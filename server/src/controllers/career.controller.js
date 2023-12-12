"use strict";
import { getStudentCareer, getStudentCV } from "../services/career.services.js";

export const getCareerByStudentId = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if(!studentId) 
            return res.status(400).json({ error: 'Student id is required.' });
        if(isNaN(studentId))
            return res.status(400).json({ error: 'Student id must be a number.' });
        const result = await getStudentCareer(studentId);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if(!file) 
            return res.status(400).json({ error: 'File is required.' });
        if(file.mimetype !== 'application/pdf')
            return res.status(400).json({ error: 'File must be a pdf.' });
        return res.status(200).json({ message: 'File uploaded successfully.', file });
    } catch (error) {
        return res.status(500).json({ error: 'Error uploading file.', details: error.message });
    }
}

export const getFile = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if(!studentId) 
            return res.status(400).json({ error: 'Student id is required.' });
        if(isNaN(studentId))
            return res.status(400).json({ error: 'Student id must be a number.' });

        const applicationId = req.params.applicationId;
        if(!applicationId) 
            return res.status(400).json({ error: 'Application id is required.' });
        if(isNaN(applicationId))
            return res.status(400).json({ error: 'Application id must be a number.' });
        const result = await getStudentCV(studentId, applicationId);
        if(result)
            return res.status(200).json(result);
        return res.status(404).json({ error: 'File not found.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
