"use strict";
import { Router } from 'express';
import { getCareerByStudentId, getFile } from '../controllers/career.controller.js';
import multer from 'multer';
import { isLoggedIn, isTeacher, storage } from '../config/configs.js';

const upload = multer({ storage: storage });

const router = Router();

router.get("/student/:studentId", isLoggedIn, getCareerByStudentId);

router.post("/upload/student/:studentId/proposal/:proposalId", upload.single('pdfFile'), (req, res) => {
    try {
      const file = req.file;
      return res.status(200).json({ message: 'File uploaded successfully.', file });
    } catch (error) {
      return res.status(400).json({ error: 'Error uploading file.', details: error.message });
    }
});

router.get("/download/student/:studentId/proposal/:proposalId", getFile);

export { router };