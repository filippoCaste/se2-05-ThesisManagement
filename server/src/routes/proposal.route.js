import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  deleteProposal,
  archiveProposal,
  updateProposal,
  getProposalById,
  createStudentProposalRequest,
  getProposalRequests
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isStudent, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.post('/request', isStudent, createStudentProposalRequest);

router.get("/request", getProposalRequests); // TODO: ADD isSecretary,isLoggedIn

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId)

router.delete("/:id",isLoggedIn,isTeacher,deleteProposal);

router.put("/:id/archived",isLoggedIn,isTeacher,archiveProposal);

router.put('/:proposalId', isTeacher, updateProposal);

router.get("/:proposalId", isTeacher, getProposalById);


export { router };
