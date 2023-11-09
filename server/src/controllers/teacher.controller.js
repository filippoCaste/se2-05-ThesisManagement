"use strict";
import { getTeacherById } from '../services/teacher.services.js';
import { getAllTeachers } from '../services/teacher.services.js';

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
            throw new Error('Missing request body parameter');
        }
        const teacher = await getTeacherById(id);
        return res.json(teacher);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}