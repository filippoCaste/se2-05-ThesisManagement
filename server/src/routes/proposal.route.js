import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId
} from "../controllers/proposal.controller.js";

const router = Router();

router.get("/", getProposals);

router.post("/", postProposal);

router.get('/teachers/:id', getProposalTeacherId)

export { router };
