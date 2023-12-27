import * as applications from "../../src/services/application.services.js";
import * as proposals from "../../src/services/proposal.services.js";
import * as emails from "../../src/emailService/sendEmail.js";

import { sendNotificationApplicationDecision } from "../../src/services/notificationSender.services.js";
import { saveNotificationToDB } from "../../src/services/notification.services.js";


jest.mock("../../src/emailService/sendEmail.js", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("../../src/services/application.services.js", () => ({
  getStudentEmailByApplicationId: jest.fn(),
}));

jest.mock("../../src/services/proposal.services.js", () => ({
  getProposalTitleByApplicationId: jest.fn(),
}));

jest.mock("../../src/services/notification.services.js", () => ({
  saveNotificationToDB: jest.fn(),
}));

describe('sendNotificationApplicationDecision', () => {
  test('should send notification email on valid input', async () => {

  
    // Mocking necessary functions
    applications.getStudentEmailByApplicationId.mockResolvedValue({email: 'test@example.com', student_id: 1});
    proposals.getProposalTitleByApplicationId.mockResolvedValue('Test Proposal');
    saveNotificationToDB.mockResolvedValue({message: "Notification saved to DB"});
    
    const result = await sendNotificationApplicationDecision('applicationId', 'approved');
  
    // Verify if email service was called with correct arguments
    expect(applications.getStudentEmailByApplicationId).toHaveBeenCalledWith('applicationId');
    expect(proposals.getProposalTitleByApplicationId).toHaveBeenCalledWith('applicationId');
    expect(emails.sendEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), expect.any(String));
    expect(result.message).toBe("Notification sending completed");
  });

  test('should throw error on missing fields', async () => {
    // Test for missing fields
    await expect(sendNotificationApplicationDecision('', 'approved')).rejects.toThrow('Missing required fields');
    await expect(sendNotificationApplicationDecision('applicationId', '')).rejects.toThrow('Missing required fields');
  });

  test('should throw error on user email not available', async () => {
    // Test for user email not available
    applications.getStudentEmailByApplicationId.mockResolvedValue(null);
    await expect(sendNotificationApplicationDecision('applicationId', 'approved')).rejects.toThrow('User email not available');
  });
});