import { Router } from "express";
import {
  getProposals,
  postProposal,
} from "../controllers/proposal.controller.js";

const router = Router();

router.get("/", getProposals);

router.post("/", postProposal);

export { router };
