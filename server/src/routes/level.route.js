"use strict";
import { Router } from "express";
import { getLevels } from "../controllers/level.controller.js";

const router = Router();

router.get("/", getLevels);

export { router };
