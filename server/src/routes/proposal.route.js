import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  deleteProposal,
  archiveProposal
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId)

router.delete("/:id",isLoggedIn,isTeacher,deleteProposal);

router.put("/:id",archiveProposal);

export { router };
