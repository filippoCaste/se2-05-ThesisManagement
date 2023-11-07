import { getKeyWordsFromDB, getProposalsFromDB, postNewProposal } from '../services/proposal.services.js';
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

export const postProposal = async (req, res) => {
  try {
    if (!req.body.title || !req.body.type || !req.body.description || !req.body.level || !req.body.expiration_date || !req.body.notes || !req.body.cod_degree || !req.body.supervisor_id || !req.body.cod_group ) {
      res.status(400).json({error: "Missing fields"})
    } else {
      await postNewProposal(req.body.title, req.body.type, req.body.description, req.body.level, req.body.expiration_date, req.body.notes, req.body.cod_degree, req.body.supervisor_id, req.body.cod_group);
      return res.send(200);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}