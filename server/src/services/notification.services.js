"use strict";

import { sendEmail } from "../emailService/sendEmail.js";
import { getStudentEmailByApplicationId } from "../services/application.services.js";
import { getProposalTitleByApplicationId } from "./proposal.services.js"; 
import {isEmailInputValid} from "../utils/utils.js";
import { getProposalInfoByID } from "./proposal.services.js";
import {getTeacherById} from "./teacher.services.js";

export const sendNotificationApplicationDecision = async (applicationId, status) => {
  try {
    const subject = "Thesis Management - Professor application decision";
    const title = await getProposalTitleByApplicationId(applicationId);
    console.log(title);
    const htmlMessage = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            width: 80%;
            heigth: 100vh;
            margin: auto;
            padding: 2%;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
            color: #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Application of proposal ${title} Status Update</h1>
          <p>
            Application of proposal ${title} has been updated to "${status}".
          </p>
        </div>
      </body>
    </html>
  `;
  
    if (!applicationId || !status) {
      throw new Error("Missing required fields");
    }

    // Get the student email by application ID
    const receiverEmail = await getStudentEmailByApplicationId(applicationId);

    if (!receiverEmail || !isEmailInputValid([receiverEmail])) {
      console.log(receiverEmail)
      throw new Error("User email not available");
    }
    // Send email to the retrieved email address

    await sendEmail(receiverEmail, subject, htmlMessage);

    // Return success message
    return { message: "Notification sending completed" };
  } catch (err) {
    // Handle errors
    throw new Error(err.message);
  }
};


export const sendEmailToTeacher = async (application) => {
  try {
    const proposal = await getProposalInfoByID(application.proposal_id);
    if (!proposal) return;
    const teacher = await getTeacherById(proposal.supervisor_id);
    if (!teacher) return;
    const htmlContent = `<!DOCTYPE html>
        <html>
        <head>
            <title>New Application Notification</title>
        </head>
        <body>
            <h1>Proposal Expiration Notification</h1>
            <p>Dear ${teacher.name},</p>
            <p>A new application has been submitted for your proposal with title:\n${proposal.title}. 
              The proposal expires on ${proposal.expiration_date}</p>
        </body>
        </html>`;
    await sendEmail(
      teacher.email,
      "New application for your proposal",
      htmlContent
    );
  } catch (error) {
    console.log(error);
  }
};