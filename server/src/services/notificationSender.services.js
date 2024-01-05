import { sendEmail } from "../emailService/sendEmail.js";
import {
  getStudentEmailByApplicationId,
  getCosupervisorsIdAndEmail,
} from "../services/application.services.js";
import {
  getProposalTitleByApplicationId,
  getProposalRequestInfoByID,
  getProposalInfoByID,
} from "./proposal.services.js";
import { isEmailInputValid } from "../utils/utils.js";
import { getTeacherById } from "./teacher.services.js";
import { saveNotificationToDB } from "./notification.services.js";

export const sendNotificationApplicationDecision = async (
  applicationId,
  status
) => {
  try {
    const subject = "Thesis Management - Professor application decision";
    const title = await getProposalTitleByApplicationId(applicationId);
    const text = `Application of proposal ${title} has been updated to "${status}`;
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
              ${text}
            </p>
          </div>
        </body>
      </html>
    `;

    if (!applicationId || !status) {
      throw new Error("Missing required fields");
    }

    // Get the student email by application ID
    const obj = await getStudentEmailByApplicationId(applicationId);

    if (!obj || !obj.email || !isEmailInputValid([obj.email])) {
      throw new Error("User email not available");
    }
    const receiverEmail = obj.email;
    // Send email to the retrieved email address

    await sendEmail(receiverEmail, subject, htmlMessage);

    await saveNotificationToDB(obj.student_id, subject, text);

    // Return success message
    return { message: "Notification sending completed" };
  } catch (err) {
    // Handle errors
    throw new Error(err.message);
  }
};

export const sendNotificationApplicationDecisionSupervisor = async (
  applicationId,
  status
) => {
  try {
    const subject = "Thesis Management - Supervisor application decision";
    const title = await getProposalTitleByApplicationId(applicationId);
    const content = `Application of proposal ${title} has been updated to "${status}". As a Co-supervisor you can now manage it.`;
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
              ${content}
            </p>
          </div>
        </body>
      </html>
    `;

    if (!applicationId || !status) {
      throw new Error("Missing required fields");
    }

    // Get the student email by application ID
    const receiverArray = await getCosupervisorsIdAndEmail(applicationId);

    if (!Array.isArray(receiverArray)) throw new Error("Error retriving data");
    if (receiverArray.length == 0)
      return { message: "Noitification sending complete" };

    for (const entry of receiverArray) {
      if (!entry.email || !isEmailInputValid([entry.email])) {
        throw new Error("Cosupervisor email not available");
      }
      // Send email to the retrieved email address
      await sendEmail(entry.email, subject, htmlMessage);
      await saveNotificationToDB(
        entry.id,
        "Supervisor application decision",
        content
      );
    }
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
    const content = `A new application has been submitted for your proposal with title:\n${proposal.title}. 
      The proposal expires on ${proposal.expiration_date}`;
    const htmlContent = `<!DOCTYPE html>
          <html>
          <head>
              <title>New Application Notification</title>
          </head>
          <body>
              <h1>Proposal Expiration Notification</h1>
              <p>Dear ${teacher.name},</p>
              <p>${content}</p>
          </body>
          </html>`;
    await sendEmail(
      teacher.email,
      "New application for your proposal",
      htmlContent
    );
    await saveNotificationToDB(
      teacher.id,
      "New application for your proposal",
      content
    );
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailProposalRequestToTeacher = async (requestid) => {
  try {
    const proposalRequest = await getProposalRequestInfoByID(requestid);
    if (!proposalRequest) return;
    const supervisor = await getTeacherById(proposalRequest.teacherid);
    if (!supervisor) return;

    const content = `A new student proposal request has been approved with title:\n${proposalRequest.title}. 
        The student who made the request is ${proposalRequest.student_name} ${proposalRequest.student_surname}
        The proposal requires you to be accepted or rejected`;
    const htmlContent = `<!DOCTYPE html>
          <html>
          <head>
              <title>New Student Proposal Request Notification</title>
          </head>
          <body>
              <h1>Student Proposal Request Notification</h1>
              <p>Dear ${supervisor.name},</p>
              <p>${content}</p>
          </body>
          </html>`;

    await sendEmail(supervisor.email, "New proposal request", htmlContent);
    console.log("email sent");
    await saveNotificationToDB(
        supervisor.id,
        "New student proposal request",
        content
        );
  } catch (error) {
    console.log(error);
  }
};
