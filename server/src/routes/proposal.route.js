import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  deleteProposal,
  archiveProposal,
  updateProposal,
  getProposalById
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId)

router.delete("/:id",isTeacher,deleteProposal);

router.put("/:id/archived",isLoggedIn,isTeacher,archiveProposal);

router.put('/:proposalId', isTeacher, updateProposal);

router.get("/:proposalId", isTeacher, getProposalById);

export { router };
