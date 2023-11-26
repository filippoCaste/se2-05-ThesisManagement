"use strict";
import { changeStatus, createApplicationInDb, getApplicationsByProposalId, getApplicationsByStudentId } from "../services/application.services.js";
import { isValidDateFormat } from "../utils/utils.js";

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
    const status = req.body.status.trim();

    if(status!=="accepted" && status!=="refused") {
      res.status(400).json({error: "Uncorrect fields"})
    }

    await changeStatus(applicationId, 10000, status);

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