'use strict';
import { Router } from 'express';
import { getGroups } from '../controllers/group.controller.js';
import { isLoggedIn } from '../config/configs.js';

const router = Router();

router.get('/', isLoggedIn, getGroups);

export { router };
