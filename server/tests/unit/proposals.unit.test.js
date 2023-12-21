import { getProposals } from "../../src/controllers/proposal.controller";
import { getProposalsFromDB } from "../../src/services/proposal.services";
import { getProposalRequests } from '../../src/controllers/proposal.controller';
import { getAllInfoByProposalId } from "../../src/services/proposal.services";
import { getProposalById } from '../../src/controllers/proposal.controller';
import proposalServices from '../../src/services/proposal.services';


jest.mock("../../src/services/proposal.services", () => ({
  getProposalsFromDB: jest.fn(),
  getKeyWordsFromDB: jest.fn(),
  getExtraInfoFromProposal: jest.fn(),
  getProposalRequestsFromDB: jest.fn(),
  getAllInfoByProposalId: jest.fn(),
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
  it('should return proposal requests when fetched successfully', async () => {
    const mockProposalRequests = [
      { id: 1, title: 'Proposal 1' },
      { id: 2, title: 'Proposal 2' },
    ];

    jest.spyOn(proposalServices, 'getProposalRequestsFromDB').mockResolvedValue(mockProposalRequests);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    await getProposalRequests({}, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockProposalRequests);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors and return a 500 status code', async () => {
    const errorMessage = 'Failed to fetch proposal requests';
    jest.spyOn(proposalServices, 'getProposalRequestsFromDB').mockRejectedValue(new Error(errorMessage));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    await getProposalRequests({}, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    expect(mockNext).not.toHaveBeenCalled();
  });

});







describe('getProposalById', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        proposalId: 'testProposalId',
      },
      user: {
        id: 'testUserId',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the proposal when found', async () => {
    const mockProposal = { /* Your mock proposal data */ };
    getAllInfoByProposalId.mockResolvedValue(mockProposal);

    await getProposalById(req, res, next);

    expect(getAllInfoByProposalId).toHaveBeenCalledWith('testProposalId', 'testUserId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProposal);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 404 when proposal is not found', async () => {
    getAllInfoByProposalId.mockRejectedValue(404);

    await getProposalById(req, res, next);

    expect(getAllInfoByProposalId).toHaveBeenCalledWith('testProposalId', 'testUserId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Proposal not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 when access is forbidden', async () => {
    getAllInfoByProposalId.mockRejectedValue(403);

    await getProposalById(req, res, next);

    expect(getAllInfoByProposalId).toHaveBeenCalledWith('testProposalId', 'testUserId');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'You cannot access this resource' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 500 for other errors', async () => {
    const errorMessage = 'Some internal error';
    getAllInfoByProposalId.mockRejectedValue(new Error(errorMessage));

    await getProposalById(req, res, next);

    expect(getAllInfoByProposalId).toHaveBeenCalledWith('testProposalId', 'testUserId');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    expect(next).not.toHaveBeenCalled();
  });
});
