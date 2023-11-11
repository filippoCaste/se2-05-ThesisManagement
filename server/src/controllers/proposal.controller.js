import {
  getKeyWordsFromDB,
  getProposalsFromDB,
  postNewProposal
} from "../services/proposal.services.js";
import { LevelsEnum } from "../models/LevelsEnum.js";
import { isValidDateFormat } from "../utils/utils.js";

export const getProposals = async (req, res, next) => {
  try {
    const cod_degree = req.query.cod_degree;
    const start_expiration_date = req.query.start_date;
    const end_expiration_date = req.query.end_date;

    if (!cod_degree) {
      return res.status(400).json({ message: "cod_degree is required" });
    }
    if (start_expiration_date && isValidDateFormat(start_expiration_date) === false) {
      return res
        .status(400)
        .json({
          message: "Invalid start_expiration_date, format should be YYYY-MM-dd",
        });
    }
    if (end_expiration_date && isValidDateFormat(end_expiration_date) === false) {
      return res
        .status(400)
        .json({
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
    return res.json(proposals);
  } catch (err) {
    return next(err);
  }
};

export const getKeywords = async (req, res, next) => {
  try {
    const keywords = await getKeyWordsFromDB();
    return res.json(keywords);
  } catch (err) {
    return next(err);
  }
};

export const getLevels = async (req, res, next) => {
  try {
    return res.json(LevelsEnum);
  } catch (err) {
    return next(err);
  }
};

export const postProposal = async (req, res) => {
  try {
    const title = req.body.title.trim();
    const type = req.body.type.trim();
    const description = req.body.description.trim();
    let level = req.body.level;
    let cod_group = req.body.cod_group;
    let cod_degree = req.body.cod_degree;
    try {
      level = parseInt(level);
      cod_group = parseInt(cod_group);
      cod_degree = parseInt(cod_degree);
    } catch (err) {
      res.status(400).json({ error: "Uncorrect parameters" })
    }
    const expiration_date = req.body.expiration_date.trim();
    const notes = req.body.notes.trim();

    if (!title || !type || !description || !expiration_date || 
          !notes || !cod_degree || !req.body.supervisors_obj.supervisor_id) {
      res.status(400).json({error: "Missing fields"})
    } else {
      console.log(req.body)
      for (let cod_degree in req.body.cod_degree) {
        await postNewProposal(title.trim(), type.trim(), description.trim(), level, expiration_date.trim(), notes.trim(), cod_degree, cod_group, req.body.required_knowledge, req.body.supervisors_obj, req.body.keywords);
      }
      return res.sendStatus(200);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}