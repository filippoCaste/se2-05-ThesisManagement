import request from "supertest";
import * as controllers from "../../src/controllers/proposal.controller.js";
import * as services from "../../src/services/proposal.services.js";
import * as teacherServices from "../../src/services/teacher.services.js";

jest.mock("../../src/services/proposal.services.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("postProposal", () => {
    test("should return 200 if the proposal is created", async () => {
        const mockRequest = {
            body: {
                title: "DevOps proposal",
                type:"Innovation that inspires",
                description: "This is a DevOps proposal.",
                level: 1,
                expiration_date: "2023-12-22",
                notes: "No additional notes",
                required_knowledge: "Student must know the principle of software development.",
                cod_degree: ["2"],
                cod_group: "1",
                supervisors_obj: {
                    supervisor_id: 10000,
                    co_supervisors: [
                        10001,
                        10002
                        ]
                },
                keywords: [
                    "Javascript"
                ]
            },
        };
        const mockResponse = {
            sendStatus: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(services, "postNewProposal").mockResolvedValue();

        await controllers.postProposal(mockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    test('should return 400 if the level is not a number', async () => {
        const mockRequest = {
            body: {
                title: "DevOps proposal",
                type:"Innovation that inspires",
                description: "This is a DevOps proposal.",
                level: "level",
                expiration_date: "2023-12-22",
                notes: "No additional notes",
                required_knowledge: "Student must know the principle of software development.",
                cod_degree: ["2"],
                cod_group: "1",
                supervisors_obj: {
                    supervisor_id: 10000,
                    co_supervisors: [
                        10001,
                        10002
                        ]
                },
                keywords: [
                    "Javascript"
                ]
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controllers.postProposal(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Uncorrect fields" });
    });

    test('should return 500 if error' , async () => {
        const mockRequest = {
            body: {
                title: "Proposal title",
                type: "Proposal type",
                description: "Proposal description",
                level: 2,
                cod_group: 1,
                cod_degree: 2,
                expiration_date: "2021-12-31",
                notes: "Proposal notes"
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(services, "postNewProposal").mockRejectedValue();

        await controllers.postProposal(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    test('should return 400 if a field is missing' , async () => {
        const mockRequest = {
            body: {
                type:"Innovation that inspires",
                description: "This is a DevOps proposal.",
                level: "level",
                expiration_date: "2023-12-22",
                notes: "No additional notes",
                required_knowledge: "Student must know the principle of software development.",
                cod_degree: ["2"],
                cod_group: "1",
                supervisors_obj: {
                    supervisor_id: 10000,
                    co_supervisors: [
                        10001,
                        10002
                        ]
                },
                keywords: [
                    "Javascript"
                ]
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controllers.postProposal(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
});

describe("getProposalTeacherId", () => {
    test("should return an array with the proposals of the teacher", async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockApplicationsData = [
            [
                {
                  id: 15,
                  title: "Thesis proposal IV",
                  description: "This is an innovative proposal.",
                  type: "Innovation that inspires",
                  level: 4,
                  expiration_date: "2024-03-01T00:00:00+01:00",
                  notes: "No additional notes",
                  cod_degree: 2,
                  cod_group: 1,
                  required_knowledge: "Student must know the principle of design of mobile applications.",
                  status: "posted",
                  title_degree: "COMMUNICATIONS ENGINEERING",
                  title_group: "Elite"
                }
              ]
        ];
        const mockTeacherData = {
            id: 1,
            surname: "Rossi",
            name: "Mario",
            email: "",
            cod_group: 1,
            cod_department: "ICM",
            title_group: "Elite"
        };

        jest.spyOn(teacherServices, "getTeacherById").mockResolvedValue(mockTeacherData);
        jest.spyOn(services, "getProposalsByTeacherId").mockResolvedValue(mockApplicationsData);

        await controllers.getProposalTeacherId(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockApplicationsData);
    });

    test('should return 500 if error' , async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(teacherServices, "getTeacherById").mockRejectedValue();

        await controllers.getProposalTeacherId(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    test('should return 400 if the teacher does not exist' , async () => {
        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(teacherServices, "getTeacherById").mockResolvedValue(null);

        await controllers.getProposalTeacherId(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    
});