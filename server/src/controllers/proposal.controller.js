import { getKeyWordsFromDB, getProposalsFromDB } from '../services/proposal.services.js';
import { LevelsEnum } from '../models/LevelsEnum.js';

export const getProposals = async (req, res, next) => {
  try {

    const { start_expiration_date, end_expiration_date } = req.query;
    const { supervisor_id } = req.query;

    const keyword_ids = req.query.keyword_ids ? JSON.parse(req.query.keyword_ids) : [];
    const level_ids = req.query.level_ids ? JSON.parse(req.query.level_ids) : [];

    const proposals = await getProposalsFromDB(level_ids, keyword_ids, supervisor_id);
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
