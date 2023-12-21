import { getProposals } from "../../src/controllers/proposal.controller";
import { getProposalsFromDB } from "../../src/services/proposal.services";
import { getProposalRequests } from '../../src/controllers/proposal.controller';
import { getProposalRequestsFromDB } from "../../src/services/proposal.services";
import proposalServices from '../../src/services/proposal.services';



jest.mock("../../src/services/proposal.services", () => ({
  getProposalsFromDB: jest.fn(),
  getKeyWordsFromDB: jest.fn(),
  getExtraInfoFromProposal: jest.fn(),
  getProposalRequestsFromDB: jest.fn()
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

    await getProposals(req, res, next);

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

    await getProposals(req, res, next);

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

    await getProposals(req, res, next);

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

    getProposalsFromDB.mockImplementation(() => {
      throw new Error("test");
    });

    await getProposals(req, res, next);

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

    getProposalsFromDB.mockImplementation(() => {
      return { proposals: [] };
    });

    await getProposals(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(getProposalsFromDB).toHaveBeenCalledWith(
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


describe('getProposalRequests', () => {
  it('should return proposal requests from the database', async () => {
    // mock the getProposalRequestsFromDB function
    const mockProposalRequests = ['request1', 'request2'];
    jest.spyOn(proposalServices, 'getProposalRequestsFromDB').mockResolvedValue(mockProposalRequests);


    // mock the response and next functions
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    // call the function
    await getProposalRequests({}, mockResponse, mockNext);

    // assert the expected behavior
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockProposalRequests);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors and return a 500 status code', async () => {
    // mock the getProposalRequestsFromDB function to throw an error
    jest.spyOn(proposalServices, 'getProposalRequestsFromDB').mockRejectedValue(new Error('Database error'));

    // mock the response and next functions
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    // call the function
    await getProposalRequests({}, mockResponse, mockNext);

    // assert the expected behavior
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});