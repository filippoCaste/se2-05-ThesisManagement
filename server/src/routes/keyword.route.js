'use strict';
import { Router } from 'express';
import { getKeywords } from '../controllers/proposal.controller.js';

const router = Router();

router.get('/', getKeywords);

export { router };
