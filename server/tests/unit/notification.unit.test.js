import * as applications from "../../src/services/application.services.js";
import * as proposals from "../../src/services/proposal.services.js";
import * as emails from "../../src/emailService/sendEmail.js";

import { sendNotificationApplicationDecision } from "../../src/services/notificationSender.services.js";
import * as services from "../../src/services/notification.services.js";
import {
  changeStatusOfNotifications,
  deleteNotification,
  deleteNotificationsForUser,
  getNotificationsForUser,
} from "../../src/controllers/notification.controller.js";

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
  getAllNotificationsForUser: jest.fn(),
  getNotificationById: jest.fn(),
  deleteNotificationById: jest.fn(),
  deleteAllNotificationsForUser: jest.fn(),
  setReadNotificationsForUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getNotificationsForUser", () => {
  test("should return all notifications for user", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.getAllNotificationsForUser.mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        message: "Test notification",
        is_read: false,
        created_at: "2021-04-20T12:00:00.000Z",
      },
    ]);

    await getNotificationsForUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([
      {
        id: 1,
        user_id: 1,
        message: "Test notification",
        is_read: false,
        created_at: "2021-04-20T12:00:00.000Z",
      },
    ]);

    expect(services.getAllNotificationsForUser).toHaveBeenCalledWith(1);
  });

  test("should return 500 if an error occurs", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.getAllNotificationsForUser.mockRejectedValue(new Error("Test error"));

    await getNotificationsForUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Test error" });
    expect(services.getAllNotificationsForUser).toHaveBeenCalledWith(1);
  });
});

describe("deleteNotification", () => {
  test("should return 200 and delete notification by id", async () => {
    const mockReq = { params: { notificationId: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNotification = {
      id: 1,
      user_id: 1,
      message: "Test notification",
      is_read: false,
      created_at: "2021-04-20T12:00:00.000Z",
    };
    services.getNotificationById.mockImplementation(() => {
      return mockNotification;
    });
    services.deleteNotificationById.mockResolvedValue({});

    await deleteNotification(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Notification deleted successfully",
    });
  });

  test("should return 400 if notification id is not a number", async () => {
    const mockReq = { params: { notificationId: "test" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteNotification(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Notification ID must be a number",
    });
  });

  test("should return 404 if notification not found", async () => {
    const mockReq = { params: { notificationId: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.getNotificationById.mockResolvedValue(null);

    await deleteNotification(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Notification not found",
    });
  });

  test("should return 500 if an error occurs", async () => {
    const mockReq = { params: { notificationId: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.getNotificationById.mockRejectedValue(new Error("Test error"));

    await deleteNotification(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Test error" });
  });
});

describe("deleteNotificationsForUser", () => {
  test("should return 200 and delete all notifications for user", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.deleteAllNotificationsForUser.mockResolvedValue({});
    await deleteNotificationsForUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Notifications deleted successfully",
    });
  });

  test("should return 500 if an error occurs", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.deleteAllNotificationsForUser.mockRejectedValue(
      new Error("Test error")
    );

    await deleteNotificationsForUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Test error" });
  });
});

describe("changeStatusOfNotifications", () => {
  test("should return 200 and change status of notifications", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.setReadNotificationsForUser.mockResolvedValue({});
    await changeStatusOfNotifications(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Notifications deleted successfully",
    });
  });

  test("should return 500 if an error occurs", async () => {
    const mockReq = { user: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    services.setReadNotificationsForUser.mockRejectedValue(
      new Error("Test error")
    );

    await changeStatusOfNotifications(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Test error" });
  });
});

describe("sendNotificationApplicationDecision", () => {
  test("should send notification email on valid input", async () => {
    // Mocking necessary functions
    applications.getStudentEmailByApplicationId.mockResolvedValue({
      email: "test@example.com",
      student_id: 1,
    });
    proposals.getProposalTitleByApplicationId.mockResolvedValue(
      "Test Proposal"
    );
    services.saveNotificationToDB.mockResolvedValue({
      message: "Notification saved to DB",
    });

    const result = await sendNotificationApplicationDecision(
      "applicationId",
      "approved"
    );

    // Verify if email service was called with correct arguments
    expect(applications.getStudentEmailByApplicationId).toHaveBeenCalledWith(
      "applicationId"
    );
    expect(proposals.getProposalTitleByApplicationId).toHaveBeenCalledWith(
      "applicationId"
    );
    expect(emails.sendEmail).toHaveBeenCalledWith(
      "test@example.com",
      expect.any(String),
      expect.any(String)
    );
    expect(result.message).toBe("Notification sending completed");
  });

  test("should throw error on missing fields", async () => {
    // Test for missing fields
    await expect(
      sendNotificationApplicationDecision("", "approved")
    ).rejects.toThrow("Missing required fields");
    await expect(
      sendNotificationApplicationDecision("applicationId", "")
    ).rejects.toThrow("Missing required fields");
  });

  test("should throw error on user email not available", async () => {
    // Test for user email not available
    applications.getStudentEmailByApplicationId.mockResolvedValue(null);
    await expect(
      sendNotificationApplicationDecision("applicationId", "approved")
    ).rejects.toThrow("User email not available");
  });
});
