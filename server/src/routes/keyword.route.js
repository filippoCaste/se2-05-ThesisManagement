"use strict";
import { Router } from "express";
import { getKeywords } from "../controllers/keyword.controller.js";

const router = Router();

router.get("/", getKeywords);

export { router };
