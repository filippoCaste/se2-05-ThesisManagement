'use strict';
import { Router } from 'express';
import { getTeachers, getTeacherId } from '../controllers/teacher.controller.js';

const router = Router();

router.get('/', getTeachers);
router.get('/:id', getTeacherId)

export { router };
