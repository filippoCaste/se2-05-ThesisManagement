"use strict";
import { getTeacherById, getAllTeachers } from '../services/teacher.services.js';

export const getTeachers = async (req, res) => {
    try {
        const result = await getAllTeachers();
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const getTeacherId = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        if(isNaN(id)) {
            return res.status(400).json({ error: "Uncorrect id" })
        }
        const teacher = await getTeacherById(id);
        if (teacher) {
            return res.json(teacher);
        } else {
            res.status(404).json({ error: "User not found" })
        }
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}