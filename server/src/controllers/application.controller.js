"use strict";
import { changeStatus, createApplicationInDb, getApplicationsByProposalId, getApplicationsByStudentId } from "../services/application.services.js";
import { getProposalInfoByID } from "../services/proposal.services.js";
import { getTeacherById } from "../services/teacher.services.js";
import { sendEmail } from '../utils/sendEmail.js';
import { isValidDateFormat } from "../utils/utils.js";
import {sendNotificationApplicationDecision} from "../services/notification.services.js";
export const createApplication = async (req, res) => {
  const { proposal_id, student_id, submission_date } = req.body;
  if (!proposal_id) {
    return res
      .status(400)
      .json({ error: "Request should contain a proposal_id" });
  }
  if (!student_id) {
    return res
      .status(400)
      .json({ error: "Request should contain a student_id" });
  }
  if (!submission_date || isValidDateFormat(submission_date) === false) {
    return res.status(400).json({
      error:
        "Request should contain a submission_date and be in the format YYYY-MM-dd",
    });
  }
  try {
    const application = await createApplicationInDb(
      proposal_id,
      student_id,
      submission_date
      );
    await sendEmailToTeacher(application);
    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getApplicationsProposalId = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await getApplicationsByProposalId(id);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export const getApplicationsStudentId = async (req, res) => {
  try {
      const studentid = req.user.id;
      const result = await getApplicationsByStudentId(studentid);
      return res.json(result);
  } catch (err) {
      return res.status(500).json({ error: err.message });
  }
};

export const changeStatusOfApplication = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    if(!req.body.status) {
      res.status(400).json({ error: "Incorrect fields" })
    }
    const status = req.body.status.trim();

    if(status !== "accepted" && status !== "rejected" && status !== "canceled") {
      res.status(400).json({error: "Incorrect fields"})
    }

    await changeStatus(applicationId, req.user.id, status);


   await sendNotificationApplicationDecision(applicationId,status);
    res.status(204).send();

  } catch(err) {
    if (err == 404) {
      res.status(404).json({ error: "Proposal not found" })
    } else if (err == 403) {
      res.status(403).json({ error: "You cannot access this resource" })
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

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
