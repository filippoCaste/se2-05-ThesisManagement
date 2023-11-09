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
    const title = req.body.title;
    const type = req.body.type;
    const description = req.body.description;
    let level = req.body.level;
    let cod_group = req.body.cod_group;
    try {
      level = parseInt(level);
      cod_group = parseInt(cod_group)
    } catch (err) {
      res.status(400).json({ error: "Uncorrect parameters" })
    }
    const expiration_date = req.body.expiration_date;
    const notes = req.body.notes;

    if (!title || !type || !description || !expiration_date || 
          !notes || !req.body.cod_degree || req.body.cod_degree.length === 0 || !req.body.supervisors_obj.supervisor_id) {
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