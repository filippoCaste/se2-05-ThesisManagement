"use strict";
import { Router } from "express";
import { getLevels } from "../controllers/level.controller.js";
import { isLoggedIn } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getLevels);

export { router };
