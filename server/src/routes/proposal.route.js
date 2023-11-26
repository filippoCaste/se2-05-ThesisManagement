import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  updateProposal,
  getProposalById
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId)

router.put('/:proposalId', isTeacher, updateProposal)

router.get("/:proposalId", isTeacher, getProposalById);

export { router };
