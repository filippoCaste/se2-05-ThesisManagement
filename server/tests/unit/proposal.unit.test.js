import * as controllers from "../../src/controllers/proposal.controller.js";
import * as services from "../../src/services/proposal.services.js";
import * as teacherServices from "../../src/services/teacher.services.js";
import * as keywords from "../../src/services/keyword.services.js";
import * as notifications from "../../src/services/notificationSender.services.js";

jest.mock("../../src/services/notification.services", () => ({
  sendEmailProposalRequestToTeacher: jest.fn(),
}));

jest.mock("../../src/services/proposal.services", () => ({
  getProposalsFromDB: jest.fn(),
  getKeyWordsFromDB: jest.fn(),
  getExtraInfoFromProposal: jest.fn(),
  postNewProposal: jest.fn(),
  getProposalById: jest.fn(),
  updateProposalByProposalId: jest.fn(),
  getProposalsByTeacherId: jest.fn(),
  deleteProposalById: jest.fn(),
  getSupervisorByProposalId: jest.fn(),
  getProposalsByCoSupervisorId: jest.fn(),
  createProposalRequest: jest.fn(),
  changeStatusProRequest: jest.fn(),
  updateThesisRequestStatus: jest.fn(),
}));

jest.mock("../../src/services/keyword.services", () => ({
  getKeywordByName: jest.fn(),
  postKeyword: jest.fn(),
}));

jest.mock("../../src/services/teacher.services", () => ({
  getTeacherById: jest.fn(),
  getTeacherByEmail: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getProposals", () => {
  test("should return 400 error if cod_degree is not present", async () => {
    const req = {
      query: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await controllers.getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Request should contain a cod_degree",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 400 error if start_expiration_date is invalid", async () => {
    const req = {
      query: {
        cod_degree: "test",
        start_date: "test",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await controllers.getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid start_expiration_date, format should be YYYY-MM-dd",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 400 error if end_expiration_date is invalid", async () => {
    const req = {
      query: {
        cod_degree: "test",
        end_date: "test",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await controllers.getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid end_expiration_date, format should be YYYY-MM-dd",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 error if getProposalsFromDB throws an error", async () => {
    const req = {
      query: {
        cod_degree: "test",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    services.getProposalsFromDB.mockImplementation(() => {
      throw new Error("test");
    });

    await controllers.getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "test" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 200 and call getProposalsFromDB if cod_degree is present", async () => {
    const req = {
      query: {
        cod_degree: "test",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    services.getProposalsFromDB.mockImplementation(() => {
      return { proposals: [] };
    });

    await controllers.getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(services.getProposalsFromDB).toHaveBeenCalledWith(
      "test",
      [],
      [],
      undefined,
      undefined,
      undefined
    );
    expect(res.json).toHaveBeenCalledWith({ proposals: [] });
  });
});

describe("postProposal", () => {
  test("should return 201 if the proposal is created", async () => {
    const mockRequest = {
      params: { proposalId: 1 },
      body: {
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: [2],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    keywords.getKeywordByName.mockResolvedValue("Test");
    keywords.postKeyword.mockResolvedValue();
    services.postNewProposal.mockResolvedValue();

    await controllers.postProposal(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(services.postNewProposal).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if some field type is incorrect", async () => {
    const mockRequest = {
      params: { proposalId: 1 },
      body: {
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: ["error"],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.postProposal(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Uncorrect fields",
    });
  });

  test("should return 500 if error", async () => {
    const mockRequest = {
      body: {
        title: "Proposal title",
        type: "Proposal type",
        description: "Proposal description",
        level: "MSc",
        cod_group: 1,
        cod_degree: 2,
        expiration_date: "2021-12-31",
        notes: "Proposal notes",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.postNewProposal.mockRejectedValue();

    await controllers.postProposal(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  test("should return 400 if a field is missing", async () => {
    const mockRequest = {
      body: {
        type: "Innovation that inspires",
        description: "This is a DevOps proposal.",
        level: "level",
        expiration_date: "2023-12-22",
        notes: "No additional notes",
        required_knowledge:
          "Student must know the principle of software development.",
        cod_degree: ["2"],
        cod_group: "1",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001, 10002],
        },
        keywords: ["Javascript"],
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
        id: 1,
      },
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
          required_knowledge:
            "Student must know the principle of design of mobile applications.",
          status: "posted",
          title_degree: "COMMUNICATIONS ENGINEERING",
          title_group: "Elite",
        },
      ],
    ];
    const mockTeacherData = {
      id: 1,
      surname: "Rossi",
      name: "Mario",
      email: "",
      cod_group: 1,
      cod_department: "ICM",
      title_group: "Elite",
    };

    teacherServices.getTeacherById.mockResolvedValue(mockTeacherData);
    services.getProposalsByTeacherId.mockResolvedValue(mockApplicationsData);

    await controllers.getProposalTeacherId(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith(mockApplicationsData);
  });

  test("should return 500 if error", async () => {
    const mockRequest = {
      params: {
        id: 1,
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(teacherServices, "getTeacherById").mockRejectedValue();

    await controllers.getProposalTeacherId(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  test("should return 400 if the teacher does not exist", async () => {
    const mockRequest = {
      params: {
        id: 1,
      },
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

    for (let wrongField of wrongFields) {
      mockReq.body[wrongField.field] = wrongField.value;
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
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: ["error"],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    keywords.getKeywordByName.mockResolvedValue("Test");
    services.updateProposalByProposalId.mockImplementation(() => {
      throw new Error("Proposal not found");
    });

    await controllers.updateProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Proposal not found" });
  });

  test("should return 403 if proposal is not owned by the teacher", async () => {
    const mockReq = {
      params: { proposalId: 1 },
      user: { id: 1 },
      body: {
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: ["error"],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    keywords.getKeywordByName.mockResolvedValue("Test");
    services.updateProposalByProposalId.mockImplementation(() => {
      throw new Error("You cannot access this resource");
    });

    await controllers.updateProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "You cannot access this resource",
    });
  });

  test("should return 500 if error", async () => {
    const mockReq = {
      params: { proposalId: 1 },
      user: { id: 1 },
      body: {
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: ["error"],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    keywords.getKeywordByName.mockResolvedValue("Test");
    services.updateProposalByProposalId.mockImplementation(() => {
      throw Error("Unexpected error");
    });

    await controllers.updateProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unexpected error" });
  });

  test("should return 200 if the proposal is updated", async () => {
    const mockReq = {
      params: { proposalId: 1 },
      user: { id: 1 },
      body: {
        title: "Computer vision techniques for mobile testing",
        type: "External Thesis at company",
        description:
          "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        level: "MSc",
        cod_degree: ["error"],
        cod_group: 1,
        keywords: ["AI", "Computer Vision", "Mobile Testing"],
        expiration_date: "2024-07-20",
        supervisors_obj: {
          supervisor_id: 10000,
          co_supervisors: [10001],
        },
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    keywords.getKeywordByName.mockResolvedValue("Test");
    services.updateProposalByProposalId.mockResolvedValue(true);

    await controllers.updateProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });
});

describe("deleteProposal", () => {
  test("should return 403 if proposal is not owned by the teacher", async () => {
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.getSupervisorByProposalId.mockResolvedValue(null);

    await controllers.deleteProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "User does not have the permissions for this operation",
    });
  });

  test("should return 400 if error to delete proposal", async () => {
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.getSupervisorByProposalId.mockResolvedValue(1);
    services.deleteProposalById.mockResolvedValue(null);

    await controllers.deleteProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Could not delete the proposal",
    });
  });

  test("should return 400 if error to delete proposal", async () => {
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.getSupervisorByProposalId.mockResolvedValue(1);
    services.deleteProposalById.mockResolvedValue(null);

    await controllers.deleteProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Could not delete the proposal",
    });
  });

  test("should return 200 if proposal is deleted successfully", async () => {
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.getSupervisorByProposalId.mockResolvedValue(1);
    services.deleteProposalById.mockResolvedValue(
      "Proposal deleted successfully"
    );

    await controllers.deleteProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Proposal deleted successfully",
    });
  });

  test("should return 500 if delete proposal throws error", async () => {
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    services.getSupervisorByProposalId.mockResolvedValue(1);
    services.deleteProposalById.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    await controllers.deleteProposal(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unexpected error" });
  });
});

describe("createStudentProposalRequest", () => {
  test("should return 400 if teacher email is not valid", async () => {
    const mockReq = {
      body: {
        teacherEmail: "not an email",
        coSupervisorsEmails: ["example@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Teacher email is not correct",
    });
  });

  test("should return 400 if title or description are empty strings", async () => {
    const mockReq = {
      body: {
        teacherEmail: "example@email.com",
        coSupervisorsEmails: ["example@email.com"],
        title: "",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Title and description should be not empty strings",
    });
  });

  test("should return 400 if teacher does not exist", async () => {
    const mockReq = {
      body: {
        teacherEmail: "example@email.com",
        coSupervisorsEmails: ["example@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValue(null);

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Teacher not found" });
  });

  test("should return 400 if any of co-supervisors emails are not valid", async () => {
    const mockReq = {
      body: {
        teacherEmail: "example@email.com",
        coSupervisorsEmails: ["@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValue({});

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Co-supervisors ids should be an array of emails",
    });
  });

  test("should return 400 if co-supervisor does not exist", async () => {
    const mockReq = {
      body: {
        teacherEmail: "example@email.com",
        coSupervisorsEmails: ["example@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValueOnce({});
    teacherServices.getTeacherByEmail.mockResolvedValueOnce(null);

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Co-supervisor with email example@email.com not found",
    });
  });

  test("should return 500 if createProposalRequest throws error", async () => {
    const mockReq = {
      user: { id: 1 },
      body: {
        teacherEmail: "example@email.com",
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValue({});

    services.createProposalRequest.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unexpected error" });
  });

  test("should return 201 if proposal request is created successfully", async () => {
    const mockReq = {
      user: { id: 1 },
      body: {
        teacherEmail: "example@email.com",
        title: "Test",
        description: "Test",
        notes: "Test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValue({});

    services.createProposalRequest.mockResolvedValue({
      id: 1,
      student_id: 1,
      teacher_id: 1,
      co_supervisors_ids: undefined,
      title: "Test",
      description: "Test",
      notes: "Test",
      type: "submitted",
    });

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      student_id: 1,
      teacher_id: 1,
      co_supervisors_ids: undefined,
      title: "Test",
      description: "Test",
      notes: "Test",
      type: "submitted",
    });
  });

  test("should return 400 if the status is not correct", async () => {
    const mockReq = {
      body: {
        teacherEmail: "mario.rossi@polito.it",
        coSupervisorsEmails: ["example@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
        status: "uncorrect",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error:
        "Status should be 'accepted' for requests from an existing proposals",
    });
  });

  test("should return 200 if the proposal request starting from an existing application is okay", async () => {
    const mockReq = {
      user: { id: 1 },
      body: {
        teacherEmail: "mario.rossi@polito.it",
        coSupervisorsEmails: ["example@email.com"],
        title: "Test",
        description: "Test",
        notes: "Test",
        status: "approved",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    teacherServices.getTeacherByEmail.mockResolvedValue({});
    await controllers.createStudentProposalRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
  });
});

describe('getProposalCoSupervisorId', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
  });

  it('should return an error with status 400 if the teacher_id is not a number', async () => {
    mockReq.params.id = 'invalid-id';
    await controllers.getProposalCoSupervisorId(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ error: 'Uncorrect teacher id' });
  });

  it('should return an error with status 400 if the teacher does not exist', async () => {
    mockReq.params.id = '123';
    await controllers.getProposalCoSupervisorId(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ error: 'Uncorrect filter parameter' });
  });

  it('should return an error with status 500 if an error occurs', async () => {
    const mockTeacherData = {
      id: 1,
      surname: "Rossi",
      name: "Mario",
      email: "",
      cod_group: 1,
      cod_department: "ICM",
      title_group: "Elite"
    };
    mockReq.params.id = '1';

    teacherServices.getTeacherById.mockResolvedValue(mockTeacherData);
    services.getProposalsByCoSupervisorId.mockRejectedValue(new Error("this should fail"));
    await controllers.getProposalCoSupervisorId(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  it('should return the proposals with status 200 if the teacher exists', async () => {
    const mockTeacherData = {
      id: 1,
      surname: "Rossi",
      name: "Mario",
      email: "",
      cod_group: 1,
      cod_department: "ICM",
      title_group: "Elite"
    };

    mockReq.params.id = '1';
    const proposals = [{ id: 1, title: 'Proposal 1' }, { id: 2, title: 'Proposal 2' }];
    teacherServices.getTeacherById.mockResolvedValue(mockTeacherData);
    services.getProposalsByCoSupervisorId.mockResolvedValueOnce(proposals);
    await controllers.getProposalCoSupervisorId(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(proposals);
  })
});

describe('changeStatusProposalRequest', () => {
  it('should handle correct type and return a 204 status code', async () => {
    const mockRequest = {
      params: {
        requestid: "someRequestId",
      },
      body: {
        status: "approved",
      },
    };

    jest.spyOn(services, "changeStatusProRequest").mockResolvedValue();
    jest
      .spyOn(notifications, "sendEmailProposalRequestToTeacher")
      .mockResolvedValue(); // Update to the imported notifications

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controllers.changeStatusProposalRequest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it("should handle incorrect type and return a 400 status code", async () => {
    const mockRequest = {
      params: {
        requestid: "someRequestId",
      },
      body: {
        type: "invalidType",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.changeStatusProposalRequest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Incorrect fields",
    });
  });

  it("should handle RequestNotFound and return a 404 status code", async () => {
    const mockRequest = {
      params: {
        requestid: "nonExistentId",
      },
      body: {
        status: "approved",
      },
    };

    jest
      .spyOn(services, "changeStatusProRequest")
      .mockRejectedValue(new Error("RequestNotFound"));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.changeStatusProposalRequest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Proposal Request not found",
    });
  });

  it("should handle ForbiddenAccess and return a 403 status code", async () => {
    const mockRequest = {
      params: {
        requestid: "someRequestId",
      },
      body: {
        status: "approved",
      },
    };

    jest
      .spyOn(services, "changeStatusProRequest")
      .mockRejectedValue(new Error("ForbiddenAccess"));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.changeStatusProposalRequest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "You cannot access this resource",
    });
  });

  it("should handle other errors and return a 500 status code", async () => {
    const mockRequest = {
      params: {
        requestid: "someRequestId",
      },
      body: {
        status: "approved",
      },
    };

    jest
      .spyOn(services, "changeStatusProRequest")
      .mockRejectedValue(new Error("Some other error"));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controllers.changeStatusProposalRequest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Some other error",
    });
  });
});
describe("updateThesisStatus", () => {
  test("should update thesis request status in the database", async () => {
    const mockRequest = {
      params: {
        id: "127",
      },
      body: {
        status: "Approve",
      },
    };

    jest.spyOn(services, "updateThesisRequestStatus").mockResolvedValue();

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Using resolves matcher for the successful case
    await controllers.updateThesisStatus(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });
  test("should update thesis request status to 'request change' and add note", async () => {
    const mockRequest = {
      params: {
        id: "127",
      },
      body: {
        status: "Request Change",
        note: "Some note for testing",
      },
    };

    jest.spyOn(services, "updateThesisRequestStatus").mockResolvedValue();

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Using resolves matcher for the successful case
    await controllers.updateThesisStatus(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });
  it("should handle incorrect type and return a 400 status code", async () => {
    const mockRequest = {
      params: {
        id: "127",
      },
      body: {
        status: "invalidType",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.spyOn(services, "updateThesisRequestStatus").mockResolvedValue();
    await controllers.updateThesisStatus(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
  test("should reject with an error for an invalid status", async () => {
    const mockRequest = {
      params: {
        id: "nonExistentId",
      },
      body: {
        status: "Approve",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    // Using rejects matcher for the error case
    await controllers.updateThesisStatus(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalled();
  });
})
