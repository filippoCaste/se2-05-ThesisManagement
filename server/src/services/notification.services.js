"use strict";

import { sendEmail } from "../emailService/sendEmail.js";
import { getStudentEmailByApplicationId } from "../services/application.services.js";

export const sendNotificationApplicationDecisionByApplicationId = async (applicationId, htmlContent) => {
  try {
    const subject = "Thesis Management - Professor application decision";
    
    if (!applicationId || !htmlContent) {
      throw new Error("Missing required fields");
    }

    // Get the student email by application ID
    const receiverEmail = await getStudentEmailByApplicationId(applicationId);

    if (!receiverEmail) {
      throw new Error("User email not available");
    }
    // Send email to the retrieved email address
    await sendEmail(receiverEmail, subject, htmlContent);

    // Return success message
    return { message: "Notification sending completed" };
  } catch (err) {
    // Handle errors
    throw new Error(err.message);
  }
};
