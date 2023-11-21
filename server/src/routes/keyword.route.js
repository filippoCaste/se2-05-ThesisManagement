"use strict";
import { Router } from "express";
import { getKeywords } from "../controllers/keyword.controller.js";
import { isLoggedIn, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getKeywords);

export { router };
