"use strict";

import { getAllKeywords } from "../services/keyword.services.js";

export const getKeywords = async (req, res) => {
    try {
        const result = await getAllKeywords();
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
