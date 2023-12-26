"use strict";
import { Router } from "express";
import { getKeywords } from "../controllers/keyword.controller.js";
import { getKeywordsWithProposalId } from "../controllers/keyword.controller.js";
import { isLoggedIn } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getKeywords);
router.get("/proposals", isLoggedIn, getKeywordsWithProposalId);

export { router };
