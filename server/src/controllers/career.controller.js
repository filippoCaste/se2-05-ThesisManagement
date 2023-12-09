"use strict";
import { getStudentCareer, getStudentCV } from "../services/career.services.js";

export const getCareerByStudentId = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await getStudentCareer(studentId);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getFile = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const applicationId = req.params.applicationId;
        const result = await getStudentCV(studentId, applicationId);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
