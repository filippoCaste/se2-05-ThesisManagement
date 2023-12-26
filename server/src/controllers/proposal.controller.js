import {
  getAllInfoByProposalId,
  getProposalsByTeacherId,
  getProposalsFromDB,
  getProposalsByCoSupervisorId,
  postNewProposal,
  deleteProposalById,
  getSupervisorByProposalId,
  archiveProposalByProposalId,
  updateProposalByProposalId,
  getProposalRequestsFromDB,
  changeStatusProRequest,
  createProposalRequest
} from "../services/proposal.services.js";
import { isEmailInputValid, isNumericInputValid, isTextInputValid } from "../utils/utils.js";
import { getTeacherByEmail, getTeacherById } from "../services/teacher.services.js";
import { getKeywordByName, postKeyword } from "../services/keyword.services.js";

import { getEmailById } from "../services/user.services.js";
import {scheduleEmailOneWeekBefore} from "../emailService/planEmail.js";
import {sendEmailProposalRequestToTeacher} from "../services/notification.services.js"

import validator from "validator";


export const getProposals = async (req, res, next) => {
  try {
    const cod_degree = req.query.cod_degree;
    const start_expiration_date = req.query.start_date;
    const end_expiration_date = req.query.end_date;

    if (!cod_degree) {
      return res.status(400).json({ error: "Request should contain a cod_degree" });
    }
    if (
      start_expiration_date &&
      validator.isDate(start_expiration_date) === false
    ) {
      return res.status(400).json({
        message: "Invalid start_expiration_date, format should be YYYY-MM-dd",
      });
    }
    if (
      end_expiration_date &&
      validator.isDate(end_expiration_date) === false
    ) {
      return res.status(400).json({
        message: "Invalid end_expiration_date, format should be YYYY-MM-dd",
      });
    }

    const supervisor_id = req.query.supervisor_id;

    const keyword_ids = req.query.keyword_ids
      ? JSON.parse(req.query.keyword_ids)
      : [];
    const level_ids = req.query.level_ids
      ? JSON.parse(req.query.level_ids)
      : [];

    const proposals = await getProposalsFromDB(
      cod_degree,
      level_ids,
      keyword_ids,
      supervisor_id,
      start_expiration_date,
      end_expiration_date
    );
    return res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 
 * @param {*} req: `req.body` must contain fields: *title*, *type*, *description*, *level*, *cod_group*, *cod_degree*, *expiration_date*, *supervisors_obj*, *keywords*
 * @param {*} res 
 * @returns 
 */
export const postProposal = async (req, res) => {
  try {
    const { title, type, description, level, cod_group, cod_degree, expiration_date, supervisors_obj, keywords } = req.body;


    if (!isNumericInputValid([cod_group])
      || !isNumericInputValid(cod_degree)
      || !isTextInputValid(keywords)
      || !isTextInputValid([title, type, description, level])
      || !validator.isDate(expiration_date)
      || !isSupervisorsObjValid(supervisors_obj)
    ) {
      return res.status(400).json({ error: "Uncorrect fields" });
    } else {
      for(let kw of keywords) {
        const k = await getKeywordByName(kw.trim());
        if (!k) {
          await postKeyword(kw);
        }
      }
      for (let cod of cod_degree) {
        await postNewProposal(
          title.trim(),
          type.trim(),
          description.trim(),
          level.trim(),
          expiration_date.trim(),
          req.body.notes || '',
          cod,
          cod_group,
          req.body.required_knowledge,
          supervisors_obj,
          keywords
        );
      }
    
      const supervisorEmail = getEmailById(supervisors_obj.supervisor_id);
      
      //send to the professor
      scheduleEmailOneWeekBefore(expiration_date,supervisorEmail,title); //formatted yyyy-mm-dd

      return res.status(201).send();
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProposalTeacherId = async (req, res) => {
  try {
    let teacher_id = req.params.id;
    try {
      teacher_id = parseInt(teacher_id);
      const teacher = await getTeacherById(teacher_id);
      if(!teacher) {
        return res.status(400).send({error: "Uncorrect filter parameter"})
      }
    } catch(err) {
      throw new Error("Problems with integer conversion")
    }
    const proposals = await getProposalsByTeacherId(teacher_id);
    return res.json(proposals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProposalCoSupervisorId = async (req, res) => {
  try {
    let teacher_id = req.params.id;
    if(!isNumericInputValid([teacher_id])) {
      console.log("uncorrect teacher id")
      return res.status(400).send({error: "Uncorrect teacher id"})
    }
    teacher_id = parseInt(teacher_id);
    const teacher = await getTeacherById(teacher_id);
    if(!teacher) {
      console.log("uncorrect filter parameters")
      return res.status(400).send({error: "Uncorrect filter parameter"})
    }

    const proposals = await getProposalsByCoSupervisorId(teacher_id);
    return res.json(proposals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const teacherid = req.user.id;

    const supervisorid = await getSupervisorByProposalId(proposalId);

    if (!supervisorid || supervisorid !== teacherid) {
      return res
        .status(403)
        .json({
          error: "User does not have the permissions for this operation",
        });
    }
    const deletedProposalMessage = await deleteProposalById(proposalId);
    if (deletedProposalMessage)
      return res.status(200).json({ message: deletedProposalMessage });
    else res.status(400).json({ error: "Could not delete the proposal"});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const archiveProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const teacherid = req.user.id;
    
    if (
      isNaN(proposalId) || proposalId < 0
    ) {
      return res.status(400).json({ error: "Uncorrect fields" });
    }

    const supervisorid = await getSupervisorByProposalId(proposalId);
 
    if (supervisorid && supervisorid == teacherid) {
        const archiveproposalResponse = await archiveProposalByProposalId(proposalId);
        if (archiveproposalResponse) {
          return res.status(200).json({
            message: `Proposal ${proposalId} archived successfully`
          });
        }        
        else throw new Error(" couldn't archive the proposal")
    }else {throw new Error(" teacher has no permissions!")}
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 
 * @param {*} req  
 * The request object:
 * - `req.body` must contain: title, type, description, level, cod_group, cod_degree, expiration_date, supervisors_obj, keywords  
 * - `req.params` must contain: proposalId
 * @param {*} res 
 * The response code:
 * - 204: No Content -> successful operation
 * - 400: Bad Request -> uncorrect fields
 * - 401: Unauthorized
 * - 500: Internal server error 
 */
export const updateProposal = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;

    const { title, type, description, level, cod_group, cod_degree, expiration_date, notes, supervisors_obj, keywords } = req.body;

    if(!isNumericInputValid([cod_group, proposalId]) 
          || !isTextInputValid(keywords)
          || !isTextInputValid([title, type, description, level])
          || !validator.isDate(expiration_date)
          || !isSupervisorsObjValid(supervisors_obj)
      ) {
      return res.status(400).json({error: "Uncorrect fields"});
    } else {
      // add new keyword if not already in the database
      for (let kw of keywords) {
        const k = await getKeywordByName(kw.trim());
        if (!k) {
          await postKeyword(kw);
        }
      }

      // update a proposal
      await updateProposalByProposalId(proposalId, req.user.id, { title, type, description, level, cod_group, cod_degree, expiration_date, notes, supervisors_obj, keywords })
      res.status(204).send();
    }

  } catch(err) {
    if(err.message == "Proposal not found") {
      res.status(404).json({error: err.message})
    } else if(err.message == "You cannot access this resource") {
      res.status(403).json({error: err.message})
    } else if(err.message === "This proposal cannot be modified") {
      res.status(400).json({error: err.message})
    } else {
      res.status(500).json({ error: err.message });
      }
  }
};

export const getProposalById = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;
    const proposal = await getAllInfoByProposalId(proposalId, req.user.id);
    res.status(200).json(proposal);
  } catch(err) {
    console.log(err);
    if (err == 404) {
      res.status(404).json({ error: "Proposal not found" })
    } else if (err == 403) {
      res.status(403).json({ error: "You cannot access this resource" })
    } else {
      res.status(500).json({ error: err.message });
    }
  } 
}


function isSupervisorsObjValid(supervisors_obj) {
  const array = supervisors_obj.co_supervisors;
  console.log(supervisors_obj);
  array.push(supervisors_obj.supervisor_id)
  return isNumericInputValid(array);
}

export const createStudentProposalRequest = async (req, res) => {
  try {
    const {
      teacherEmail,
      title,
      description,
      notes,
      coSupervisorsEmails,
    } = req.body;

    let co_supervisors_ids;

    if(!isEmailInputValid([teacherEmail])) {
      return res.status(400).json({
        error: "Teacher email is not correct",
      });
    }
    if (!isTextInputValid([title, description])) {
      return res.status(400).json({
        error: "Title and description should be not empty strings",
      });
    }
    const teacher = await getTeacherByEmail(teacherEmail);
    if (!teacher) {
      return res.status(400).json({ error: "Teacher not found" });
    }
    if (coSupervisorsEmails && coSupervisorsEmails.length > 0) {
      co_supervisors_ids = [];
      if (!isEmailInputValid([...coSupervisorsEmails])) {
        return res.status(400).json({
          error: "Co-supervisors ids should be an array of emails",
        });
      }
      for (let email of coSupervisorsEmails) {
        const co_supervisor = await getTeacherByEmail(email);
        if (!co_supervisor) {
          return res.status(400).json({
            error: `Co-supervisor with email ${email} not found`,
          });
        } else {
          co_supervisors_ids.push(co_supervisor.id);
        }
      }
    }
    const result = await createProposalRequest(
      req.user.id,
      teacher.id,
      co_supervisors_ids,
      title,
      description,
      notes
    );
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getProposalRequests = async (req, res, next) => {
  try {

    const proposalRequests = await getProposalRequestsFromDB();
    
    return res.status(200).json(proposalRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const changeStatusProposalRequest = async (req, res) => {
  try {
    const requestid = req.params.requestid;
    if (!req.body.type) {
      return res.status(400).json({ error: "Incorrect fields" });
    }

    const type = req.body.type.trim();
    if (type !== "approved" && type !== "rejected" && type !== "accept" && type !== "submitted") {
      return res.status(400).json({ error: "Incorrect fields" });
    }

    await changeStatusProRequest(requestid, type)
      .then(async () => {
        if (type === "approved") {
          await sendEmailProposalRequestToTeacher(requestid);
        }
        return res.status(204).send();
      });
  } catch (err) {
    if (err.message === "RequestNotFound") {
      return res.status(404).json({ error: "Proposal Request not found" });
    } else if (err.message === "ForbiddenAccess") {
      return res.status(403).json({ error: "You cannot access this resource" });
    } else {
      return res.status(500).json({ error: err.message });
    }
  }
};