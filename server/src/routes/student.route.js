'use strict';
import { Router } from 'express';
import { getStudentId } from '../controllers/student.controller.js';
import { isLoggedIn } from '../config/configs.js';

const router = Router();

router.get('/:id', isLoggedIn, getStudentId)

export { router };
