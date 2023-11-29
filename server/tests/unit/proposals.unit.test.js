import { getProposals } from "../../src/controllers/proposal.controller";
//import { getKeywords } from "../../src/controllers/keyword.controller";
import { getLevels } from "../../src/controllers/level.controller";
import {
  getKeyWordsFromDB,
  getProposalsFromDB,
} from "../../src/services/proposal.services";

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