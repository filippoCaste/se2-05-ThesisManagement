import { getKeyWordsFromDB, getProposalsByTeacherId, getProposalsFromDB, postNewProposal } from '../services/proposal.services.js';
import { LevelsEnum } from '../models/LevelsEnum.js';
import { getTeacherById } from '../services/teacher.services.js';

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