'use strict';
import { Router } from 'express';
import { getTeachers, getTeacherId } from '../controllers/teacher.controller.js';
import { isLoggedIn, isTeacher } from '../config/configs.js';

const router = Router();

router.get('/', isLoggedIn, getTeachers);
router.get('/:id', isTeacher, getTeacherId)

export { router };
