"use strict";
import { Router } from 'express';
import { getCareerByStudentId } from '../controllers/career.controller.js';
import { isLoggedIn, isTeacher } from '../config/configs.js';

const router = Router();

router.get("/student/:studentId", isLoggedIn, getCareerByStudentId);

//router.get("/student/:studentId/application/:applicationId", isLoggedIn, isTeacher, getPDFFile);

export { router };