import {
  getProposalsByTeacherId,
  getProposalsFromDB,
  postNewProposal,
} from "../services/proposal.services.js";
import { LevelsEnum } from "../models/LevelsEnum.js";
import { isValidDateFormat } from "../utils/utils.js";
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
 * @param {*} req: `req.body` must contain fields: *title*, *type*, *description*, *level*, *cod_group*, *cod_degree*, *expiration_date*, *supervisor_obj*, *keywords*
 * @param {*} res 
 * @returns 
 */
export const postProposal = async (req, res) => {
  try {
    const title = req.body.title;
    const type = req.body.type;
    const description = req.body.description;
    const level = req.body.level;
    let cod_group = req.body.cod_group;
    let cod_degree = req.body.cod_degree;
    try {
      cod_group = parseInt(cod_group);
      if (
        Number.isNaN(cod_group) ||
        cod_group.toString() != req.body.cod_group ||
        (level !== "MSc" &&
        level !== "BSc")
      ) {
        return res.status(400).json({ error: "Uncorrect fields" });
      }
      for (let c of cod_degree) {
        let val = parseInt(c);
        if (Number.isNaN(val) || val.toString() != c) {
          return res.status(400).json({ error: "Uncorrect fields" });
        }
      }
    } catch (err) {
      throw new Error("Errors converting to integer");
    }
    const expiration_date = req.body.expiration_date;
    const notes = req.body.notes;

    if (
      !title ||
      !type ||
      !description ||
      !expiration_date ||
      !cod_degree ||
      !req.body.supervisors_obj.supervisor_id
    ) {
      return res.status(400).json({ error: "Missing fields" });
    } else {
      for(let kw of req.body.keywords) {
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
      return res.sendStatus(200);
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