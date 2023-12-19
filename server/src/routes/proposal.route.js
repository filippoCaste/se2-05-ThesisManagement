import { Router } from "express";
import {
  getProposals,
  postProposal,
  getProposalTeacherId,
  getProposalCoSupervisorId,
  deleteProposal,
  archiveProposal,
  updateProposal,
  getProposalById,
  createStudentProposalRequest
} from "../controllers/proposal.controller.js";
import { isLoggedIn, isStudent, isTeacher } from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.get('/teachers/:id', isLoggedIn, getProposalTeacherId);

router.get('/cosupervisors/:id', isLoggedIn, getProposalCoSupervisorId);

router.delete("/:id",isLoggedIn,isTeacher,deleteProposal);

router.put("/:id/archived",isLoggedIn,isTeacher,archiveProposal);

router.put('/:proposalId', isTeacher, updateProposal);

router.get("/:proposalId", isTeacher, getProposalById);

router.post('/request', isStudent, createStudentProposalRequest)

export { router };
