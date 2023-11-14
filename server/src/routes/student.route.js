'use strict';
import { Router } from 'express';
import { getStudentId } from '../controllers/student.controller.js';

const router = Router();

router.get('/:id', getStudentId)

export { router };
