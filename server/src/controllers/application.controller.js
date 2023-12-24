"use strict";
import { changeStatus, createApplicationInDb, getApplicationsByProposalId, getApplicationsByStudentId } from "../services/application.services.js";
import {sendEmailToTeacher, sendNotificationApplicationDecision} from "../services/notification.services.js";
import validator from "validator";

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
  if (!submission_date || validator.isDate(submission_date) === false) {
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
    if (error.scheduledError != undefined)
      return res.status(400).json({ error: error.scheduledError.message });
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
    if (err.message === "Proposal not found") {
      res.status(404).json({ error: err.message })
    } else if (err.message === "You cannot access this resource") {
      res.status(403).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}