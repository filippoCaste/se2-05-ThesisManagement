import request from "supertest";
import * as controllers from "../../src/controllers/application.controller.js";
import * as services from "../../src/services/application.services.js";
import { sendNotificationApplicationDecision } from "../../src/services/notification.services.js";

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('../../src/services/application.services.js', () => ({
    createApplicationInDb: jest.fn(),
    getApplicationsByProposalId: jest.fn(),
    changeStatus: jest.fn(),
}));

jest.mock('../../src/services/notification.services.js', () => ({
    sendNotificationApplicationDecision: jest.fn(),
}));

describe('createApplication', () => {
    it('should return 400 if proposal_id is missing', async () => {
        const req = { body: { student_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a proposal_id' });
    });

    it('should return 400 if student_id is missing', async () => {
        const req = { body: { proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a student_id' });
    });

    it('should return 400 if submission_date is not in YYYY-MM-dd format', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
    });

    it('should return 400 if submission_date is missing', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023/05/15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request should contain a submission_date and be in the format YYYY-MM-dd' });
    });

    it('should return 200 if everything is OK', async () => {
        const req = { body: { student_id: '123', proposal_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.createApplicationInDb.mockImplementation(() => {
            return {
                id: 1,
                proposal_id: 123,
                student_id: 123,
                status: 'submitted',
                submission_date: '2023-05-15',
            };
        });
        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if an error occurs during database operation', async () => {
        // Mock createApplicationInDb to throw an error
        services.createApplicationInDb.mockRejectedValue(new Error('Database error'));
        const req = { body: { proposal_id: '456', student_id: '123', submission_date: '2023-05-15' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controllers.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

});

describe('getApplicationsProposalId', () => {

    test('should return an empty array if there aren\'t any applications for the proposal', async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const mockApplicationsData = [];

        jest.spyOn(services, 'getApplicationsByProposalId').mockResolvedValue(mockApplicationsData);
        await controllers.getApplicationsProposalId(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockApplicationsData);
    });

    test('should return an array with the applications if there are applications for the proposal', async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const mockApplicationdData = [
            {
                student_id: 400000,
                submission_date: "2021-05-12",
                student_name: "Mario",
                student_surname: "Rossi",
                student_email: "s400000@studenti.polito.it",
                student_nationality: "Italian",
                student_enrollment_year: 2018,
                student_title_degree: "Bachelor's degree in Computer Engineering"
            },
            {
                student_id: 400001,
                submission_date: "2021-05-12",
                student_name: "Luca",
                student_surname: "Verdi",
                student_email: "s40001@studenti.polito.it",
                student_nationality: "Italian",
                student_enrollment_year: 2018,
                student_title_degree: "Bachelor's degree in Computer Engineering"
            }
        ];

        jest.spyOn(services, 'getApplicationsByProposalId').mockResolvedValue(mockApplicationdData);
        await controllers.getApplicationsProposalId(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockApplicationdData);
    });

    test('should return 500 if error', async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const mockError = new Error('Internal Server Error');

        jest.spyOn(services, 'getApplicationsByProposalId').mockRejectedValue(mockError);
        await controllers.getApplicationsProposalId(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });

});

describe('changeStatus', () => {
    test("should return 400 if status is missing", async () => {
        const req = { body: { status: undefined }, params: { applicationId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendNotificationApplicationDecision.mockImplementation(() => {});

        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Incorrect fields" });
        expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();

    });

    test("should return 400 if status is not valid", async () => {
        const req = { body: { status: "other" }, params: { applicationId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        sendNotificationApplicationDecision.mockImplementation(() => {});

        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Incorrect fields" });
        expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
    });

    test("should return 404 if proposal is not found", async () => {
        const req = { 
            body: { status: "accepted" }, params: { applicationId: 1 },
            user: { id: 1 }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.changeStatus.mockImplementation(() => {throw 404});
        sendNotificationApplicationDecision.mockImplementation(() => {});

        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Proposal not found" });
        expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
    });

    test("should return 403 if user is not the supervisor of the proposal", async () => {
        const req = { 
            body: { status: "accepted" }, params: { applicationId: 1 },
            user: { id: 1 } 
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.changeStatus.mockImplementation(() => {throw 403});
        sendNotificationApplicationDecision.mockImplementation(() => {});
        
        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "You cannot access this resource" });
        expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
    });

    test("should return 500 if an error occurs during database operation", async () => {
        const req = { 
            body: { status: "accepted" }, params: { applicationId: 1 },
            user: { id: 1 }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        services.changeStatus.mockImplementation(() => {throw Error("Database error")});
        sendNotificationApplicationDecision.mockImplementation(() => {});

        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
        expect(sendNotificationApplicationDecision).not.toHaveBeenCalled();
    });

    test("should return 204 if everything is OK", async () => {
        const req = { 
            body: { status: "accepted" }, params: { applicationId: 1 },
            user: { id: 1 }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
        services.changeStatus.mockResolvedValue(true);
        sendNotificationApplicationDecision.mockImplementation(() => {});
        
        await controllers.changeStatusOfApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
        expect(sendNotificationApplicationDecision).toHaveBeenCalled();
    });
});

