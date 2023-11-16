import { Router } from 'express';
import { createApplication } from '../controllers/application.controller.js';

const router = Router();

router.post('/', createApplication);

export { router };
"use strict";
import { Router } from "express";
import { getApplicationsProposalId } from "../controllers/application.controller.js";

const router = Router();

router.get("/proposal/:id", getApplicationsProposalId);

export { rout