import {
  getProposalsByTeacherId,
  getProposalsFromDB,
  postNewProposal,
  updateProposalByProposalId,
} from "../services/proposal.services.js";
import { isNumericInputValid, isTextInputValid, isValidDateFormat } from "../utils/utils.js";
import { getTeacherById } from "../services/teacher.services.js";
import { getKeywordByName, postKeyword } from "../services/keyword.services.js";

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
      isValidDateFormat(start_expiration_date) === false
    ) {
      return res.status(400).json({
        message: "Invalid start_expiration_date, format should be YYYY-MM-dd",
      });
    }
    if (
      end_expiration_date &&
      isValidDateFormat(end_expiration_date) === false
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
    const { title, type, description, level, cod_group, cod_degree, expiration_date, notes, supervisors_obj, keywords } = req.body;


    if (!isNumericInputValid([cod_group])
      || !isTextInputValid(keywords)
      || !isTextInputValid([title, type, description, level])
      || !isValidDateFormat(expiration_date)
      || !isSupervisorsObjValid(supervisors_obj)
    ) {
      return res.status(400).send({ error: "Uncorrect fields" });
    } else {
      for(let kw of keywords) {
        kw = kw.trim();
        const k = await getKeywordByName(kw);
        if (!k) {
          await postKeyword(kw);
        }
      }
      for (let cod_degree of req.body.cod_degree) {
        await postNewProposal(
          title.trim(),
          type.trim(),
          description.trim(),
          level.trim(),
          expiration_date.trim(),
          notes.trim(),
          cod_degree,
          cod_group,
          req.body.required_knowledge,
          req.body.supervisors_obj,
          req.body.keywords
        );
      }
      return res.status(201);
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
}

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
 * @returns 
 */
export const updateProposal = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;

    const { title, type, description, level, cod_group, cod_degree, expiration_date, notes, supervisors_obj, keywords } = req.body;

    if(!isNumericInputValid([cod_group, proposalId]) 
          || !isTextInputValid(keywords)
          || !isTextInputValid([title, type, description, level])
          || !isValidDateFormat(expiration_date)
          || !isSupervisorsObjValid(supervisors_obj)
      ) {
      return res.status(400).send({error: "Uncorrect fields"});
    } else {
      // add new keyword if not already in the database
      for (let kw of keywords) {
        kw = kw.trim();
        const k = await getKeywordByName(kw);
        if (!k) {
          await postKeyword(kw);
        }
      }

      // update a proposal
      await updateProposalByProposalId(proposalId, req.user.id, { title, type, description, level, cod_group, cod_degree, expiration_date, notes, supervisors_obj, keywords })
      res.status(204).send();
    }

  } catch(err) {
    if(err == 404) {
      res.status(404).json({error: "Proposal not found"})
    } else if(err == 403) {
      res.status(403).json({error: "You cannot access this resource"})
    } else {
      res.status(500).json({ error: err.message });
      }
  }
};


function isSupervisorsObjValid(supervisors_obj) {
  const array = supervisors_obj.co_supervisors;
  array.push(supervisors_obj.supervisor_id)
  return isNumericInputValid(array);
}