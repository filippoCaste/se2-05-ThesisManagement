import request from "supertest";
import * as controllers from "../../src/controllers/application.controller.js";
import * as services from "../../src/services/application.services.js";

jest.mock("../../src/services/application.services.js");

beforeEach(() => {
    jest.clearAllMocks();
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