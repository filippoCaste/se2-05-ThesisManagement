'use strict';
import { Router } from 'express';
import { getDegrees } from '../controllers/degree.controller.js';

const router = Router();

router.get('/', getDegrees);

export { router };
