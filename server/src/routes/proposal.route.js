import { Router } from 'express';
import { getProposals, getKeywords, getLevels } from '../controllers/proposal.controller.js';

const router = Router();

router.get('/', getProposals);

router.get('/keywords', getKeywords);

router.get('/levels', getLevels);

export { router };
