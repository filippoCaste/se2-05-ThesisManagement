import { getKeyWordsFromDB, getProposalsFromDB } from '../services/proposal.services.js';
import { LevelsEnum } from '../models/LevelsEnum.js';

export const getProposals = async (req, res, next) => {
  try {
    const proposals = await getProposalsFromDB();
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
