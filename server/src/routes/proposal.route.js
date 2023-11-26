import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  deleteProposal,
  archiveProposal,
  updateProposal
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId)

router.delete("/:id",isLoggedIn,isTeacher,deleteProposal);

router.put("/:id",isLoggedIn,isTeacher,archiveProposal);

router.put('/:proposalId', isTeacher, updateProposal)

export { router };
