"use strict";
import { Router } from 'express';
import { changeStatusOfApplication, createApplication, getApplicationsProposalId, getApplicationsStudentId } from '../controllers/application.controller.js';
import { isLoggedIn, isStudent, isTeacher } from '../config/configs.js';

const router = Router();

router.post('/', isStudent, createApplication);

router.get("/proposal/:id", isLoggedIn, getApplicationsProposalId);

router.get("/",isLoggedIn, isStudent, getApplicationsStudentId);

router.put("/:applicationId", isTeacher, changeStatusOfApplication);

export { router };