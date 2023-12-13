import request from "supertest";
import * as controllers from "../../src/controllers/keyword.controller.js";
import * as services from "../../src/services/keyword.services.js";
import { sendNotificationApplicationDecision } from "../../src/notificationService/notificationService.js"; // Assuming the correct path to your notification service

jest.mock("../../src/emailService/sendEmail.js", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("../../src/services/application.services.js", () => ({
  getStudentEmailByApplicationId: jest.fn(),
}));

jest.mock("../../src/services/proposal.services.js", () => ({
  getProposalTitleByApplicationId: jest.fn(),
}));

describe('sendNotificationApplicationDecision', () => {
  test('should send notification email on valid input', async () => {
    const mockRequest = {};
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Mocking necessary functions
    services.getStudentEmailByApplicationId.mockResolvedValue('test@example.com');
    services.getProposalTitleByApplicationId.mockReturnValue('Test Proposal');
    request(sendNotificationApplicationDecision('applicationId', 'approved')).expect(200);

    // Verify if email service was called with correct arguments
    expect(services.getStudentEmailByApplicationId).toHaveBeenCalledWith('applicationId');
    expect(services.getProposalTitleByApplicationId).toHaveBeenCalledWith('applicationId');
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), expect.any(String));

    // Verify the response
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Notification sending completed" });
  });

  test('should throw error on missing fields', async () => {
    // Test for missing fields
    await expect(sendNotificationApplicationDecision('', 'approved')).rejects.toThrow('Missing required fields');
    await expect(sendNotificationApplicationDecision('applicationId', '')).rejects.toThrow('Missing required fields');
  });

  test('should throw error on user email not available', async () => {
    // Test for user email not available
    services.getStudentEmailByApplicationId.mockResolvedValue(null);
    await expect(sendNotificationApplicationDecision('applicationId', 'approved')).rejects.toThrow('User email not available');
  });
});
