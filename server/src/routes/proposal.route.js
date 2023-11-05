import { Router } from 'express';
import { getProposals } from '../controllers/proposal.controller.js';

const router = Router();

router.get('/', getProposals);

export { router };
