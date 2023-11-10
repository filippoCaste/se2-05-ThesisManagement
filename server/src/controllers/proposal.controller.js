import {
  getKeyWordsFromDB,
  getProposalsFromDB,
} from "../services/proposal.services.js";
import { LevelsEnum } from "../models/LevelsEnum.js";
import { isValidDateFormat } from "../utils/utils.js";

export const getProposals = async (req, res, next) => {
  try {
    const cod_degree = req.query.cod_degree;
    const start_expiration_date = req.query.start_date;
    const end_expiration_date = req.query.end_date;

    if (!cod_degree) {
      return res.status(400).json({ error: "Request should contain a cod_degree" });
    }
    if (start_expiration_date && isValidDateFormat(start_expiration_date) === false) {
      return res
        .status(400)
        .json({
          error: "Invalid start_expiration_date, format should be YYYY-MM-dd",
        });
    }
    if (end_expiration_date && isValidDateFormat(end_expiration_date) === false) {
      return res
        .status(400)
        .json({
          error: "Invalid end_expiration_date, format should be YYYY-MM-dd",
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
