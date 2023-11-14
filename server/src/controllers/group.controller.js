"use strict";
import { getAllGroups } from '../services/group.services.js';

export const getGroups = async (req, res) => {
    try {
        const result = await getAllGroups();
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}