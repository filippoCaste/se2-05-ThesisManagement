"use strict";

import { getStudentById } from "../services/student.services.js";

export const getStudentId = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            throw new Error('Missing request body parameter');
        }
        const student = await getStudentById(id);
        if(student) {
            return res.json(student);
        } else {
            res.status(404).json({error: "User not found"})
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}