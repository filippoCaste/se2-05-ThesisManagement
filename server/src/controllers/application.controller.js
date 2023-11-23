"use strict";
import { createApplicationInDb, getApplicationsByProposalId, getApplicationsByStudentId } from "../services/application.services.js";
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