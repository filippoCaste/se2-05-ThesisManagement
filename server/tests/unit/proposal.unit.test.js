import request from "supertest";
import * as controllers from "../../src/controllers/proposal.controller.js";
import * as services from "../../src/services/proposal.services.js";
import * as teacherServices from "../../src/services/teacher.services.js";
import * as keywords from "../../src/services/keyword.services.js";
import { expect } from "chai";

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
                level: "MSc",
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
                level: "MSc",
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
                  level: "MSc",
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

describe("updateProposal", () => {
  test("should return 400 if fields are incorrect", async () => {
    const wrongFields = [
      { field: "cod_group", value: "not number" },
      { field: "title", value: "" },
      { field: "keywords", value: [""] },
      { field: "expiration_date", value: "2021-13-41" },
      { field: "supervisors_obj", value: { supervisor_id: "not number" } },
    ];
    const mockReq = {
      params: { proposalId: 1 },
      body: {
        title: "Test",
        type: "Test",
        description: "Test",
        level: "Test",
        cod_degree: 1,
        cod_group: 1,
        keywords: ["Test"],
        supervisors_obj: {
          supervisor_id: 1,
          co_supervisors: [2, 3],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    for (let i = 0; i < wrongFields.length; i++) {
      mockReq.body[wrongFields[i].field] = wrongFields[i].value;
      await controllers.updateProposal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    }
  });

  test("should return 404 if proposal does not exist", async () => {
    const mockReq = {
      params: { proposalId: 1 },
      user: { id: 1 },
      body: {
        title: "Test",
        type: "Test",
        level: "Test",
        cod_degree: [1],
        cod_group: 1,
        keywords: ["Test"],
        expiration_date: "2021-12-31",
        supervisors_obj: {
          supervisor_id: 1,
          co_supervisors: [2, 3],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(keywords, "getKeywordByName").mockResolvedValue("Test");
    jest.spyOn(services, "updateProposalByProposalId").mockImplementation(() => {throw 404});

    await controllers.updateProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Proposal not found"});
  });
  
  test("should return 403 if proposal is not owned by the teacher", async () => {
    const mockReq = {
        params: { proposalId: 1 },
        user: { id: 1 },
        body: {
          title: "Test",
          type: "Test",
          level: "Test",
          cod_degree: [1],
          cod_group: 1,
          keywords: ["Test"],
          expiration_date: "2021-12-31",
          supervisors_obj: {
            supervisor_id: 1,
            co_supervisors: [2, 3],
          },
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.spyOn(keywords, "getKeywordByName").mockResolvedValue("Test");
      jest.spyOn(services, "updateProposalByProposalId").mockImplementation(() => {throw 403});
  
      await controllers.updateProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({error: "You cannot access this resource"});
  });

  test("should return 500 if error", async () => {
    const mockReq = {
        params: { proposalId: 1 },
        user: { id: 1 },
        body: {
          title: "Test",
          type: "Test",
          level: "Test",
          cod_degree: [1],
          cod_group: 1,
          keywords: ["Test"],
          expiration_date: "2021-12-31",
          supervisors_obj: {
            supervisor_id: 1,
            co_supervisors: [2, 3],
          },
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.spyOn(keywords, "getKeywordByName").mockResolvedValue("Test");
      jest.spyOn(services, "updateProposalByProposalId").mockImplementation(() => {throw Error("Unexpected error")});
  
      await controllers.updateProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({error: "Unexpected error"});
  });

  test("should return 200 if the proposal is updated", async () => {
    const mockReq = {
        params: { proposalId: 1 },
        user: { id: 1 },
        body: {
          title: "Test",
          type: "Test",
          level: "Test",
          cod_degree: [1],
          cod_group: 1,
          keywords: ["Test"],
          expiration_date: "2021-12-31",
          supervisors_obj: {
            supervisor_id: 1,
            co_supervisors: [2, 3],
          },
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
  
      jest.spyOn(keywords, "getKeywordByName").mockResolvedValue("Test");
      jest.spyOn(services, "updateProposalByProposalId").mockImplementation(() => {Promise.resolve(true)});
  
      await controllers.updateProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
  });
});