"use strict";
import { Router } from 'express';
import { getCareerByStudentId, getFile, uploadFile } from '../controllers/career.controller.js';
import multer from 'multer';
import { isTeacher, upload, isStudent } from '../config/configs.js';

const router = Router();

router.get("/student/:studentId", isTeacher, getCareerByStudentId);

router.post("/upload/student/:studentId/application/:applicationId", isStudent, upload.single('pdfFile'), uploadFile);

router.get("/download/student/:studentId/application/:applicationId", isTeacher, getFile);

export { router };