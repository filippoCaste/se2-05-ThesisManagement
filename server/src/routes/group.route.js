'use strict';
import { Router } from 'express';
import { getGroups } from '../controllers/group.controller.js';

const router = Router();

router.get('/', getGroups);

export { router };
