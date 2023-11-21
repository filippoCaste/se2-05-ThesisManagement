'use strict';
import { Router } from 'express';
import { getDegrees } from '../controllers/degree.controller.js';
import { isLoggedIn } from '../config/configs.js';

const router = Router();

router.get('/', isLoggedIn, getDegrees);

export { router };
