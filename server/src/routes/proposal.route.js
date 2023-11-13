import { Router } from 'express';
import { getProposals, getKeywords, getLevels, postProposal } from '../controllers/proposal.controller.js';

const router = Router();

router.get('/', getProposals);

router.post('/', postProposal);

router.get('/keywords', getKeywords);

router.get('/levels', getLevels);

export { router };
