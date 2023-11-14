"use strict";

import { getAllLevels } from "../services/level.services.js";

export const getLevels = async (req, res) => {
  try {
    const result = await getAllLevels();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
