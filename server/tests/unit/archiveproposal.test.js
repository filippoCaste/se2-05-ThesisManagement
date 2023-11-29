

// Import the archiveProposal function and the mock database
const {archiveProposal} = require("../../src/controllers/proposal.controller.js");
const db = require("../../src/services/proposal.services.js");

// Mock the getSupervisorByProposalId and archiveProposalByProposalId functions
jest.mock("../../src/services/proposal.services.js", () => ({
  getSupervisorByProposalId: jest.fn(),
  archiveProposalByProposalId: jest.fn(),
}));

// Create a mock request and response object
const mockRequest = (params, user) => ({
  params,
  user,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Test the archiveProposal function
describe("archiveProposal", () => {
  // Test the happy path
  test("should archive a proposal successfully if the user is the supervisor", async () => {
    // Arrange
    const req = mockRequest({ id: 1 }, { id: 2 });
    const res = mockResponse();
    db.getSupervisorByProposalId.mockResolvedValue(2); // The user is the supervisor
    db.archiveProposalByProposalId.mockResolvedValue(true); // The proposal is archived

    // Act
    await archiveProposal(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Proposal 1 archived successfully",
    });
  });

  // Test the error handling
  test("should return 400 if the proposal id is invalid", async () => {
    // Arrange
    const req = mockRequest({ id: "abc" }, { id: 2 });
    const res = mockResponse();
    console.log(req)

    // Act
    await archiveProposal(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Uncorrect fields" });
  });

  test("should return 500 if the user is not the supervisor", async () => {
    // Arrange
    const req = mockRequest({ id: 1 }, { id: 3 });
    const res = mockResponse();
    db.getSupervisorByProposalId.mockResolvedValue(2); // The user is not the supervisor

    // Act
    await archiveProposal(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: " teacher has no permissions!" });
  });

  test("should return 500 if the proposal could not be archived", async () => {
    // Arrange
    const req = mockRequest({ id: 1 }, { id: 2 });
    const res = mockResponse();
    db.getSupervisorByProposalId.mockResolvedValue(2); // The user is the supervisor
    db.archiveProposalByProposalId.mockResolvedValue(false); // The proposal could not be archived

    // Act
    await archiveProposal(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: " couldn't archive the proposal" });
  });
});
