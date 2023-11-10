import { getProposals } from "../../src/controllers/proposal.controller";
import { getProposalsFromDB } from "../../src/services/proposal.services";

jest.mock("../../src/services/proposal.services", () => ({
  getProposalsFromDB: jest.fn(),
  getKeyWordsFromDB: jest.fn(),
  getExtraInfoFromProposal: jest.fn(),
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
      error: "Invalid start_expiration_date, format should be YYYY-MM-dd",
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
      error: "Invalid end_expiration_date, format should be YYYY-MM-dd",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
