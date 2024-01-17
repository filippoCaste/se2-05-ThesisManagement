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
  createStudentProposalRequest,
  getProposalRequests,
  changeStatusProposalRequest,
  updateThesisStatus,
} from "../controllers/proposal.controller.js";
import {
  isLoggedIn,
  isSecretary,
  isStudent,
  isTeacher,
} from "../config/configs.js";

const router = Router();

router.get("/", isLoggedIn, getProposals);

router.post("/", isTeacher, postProposal);

router.post("/request", isStudent, createStudentProposalRequest);

router.get("/request", isSecretary, getProposalRequests);

router.put("/request/:requestid", isSecretary, changeStatusProposalRequest);

router.get("/request/teacher/:teacherId", isTeacher, getProposalRequests);

router.get("/teachers/:id", isLoggedIn, getProposalTeacherId);

router.get('/cosupervisors/:id', isLoggedIn, getProposalCoSupervisorId);

router.delete("/:id", isLoggedIn, isTeacher, deleteProposal);

router.put("/:id/archived", isLoggedIn, isTeacher, archiveProposal);
router.put("/:id/approval", isLoggedIn, isTeacher, updateThesisStatus);

router.put("/:proposalId", isTeacher, updateProposal);

router.get("/:proposalId", isTeacher, getProposalById);

export { router };
