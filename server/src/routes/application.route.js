"use strict";
import { Router } from 'express';
import { createApplication, getApplicationsProposalId } from '../controllers/application.controller.js';
import { isLoggedIn, isStudent, isTeacher } from '../config/configs.js';

const router = Router();

router.post('/', isStudent, createApplication);

router.get("/proposal/:id", isLoggedIn, getApplicationsProposalId);

export { router };