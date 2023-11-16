"use strict";
import { Router } from 'express';
import { createApplication, getApplicationsProposalId } from '../controllers/application.controller.js';

const router = Router();

router.post('/', createApplication);

router.get("/proposal/:id", getApplicationsProposalId);

export { router };