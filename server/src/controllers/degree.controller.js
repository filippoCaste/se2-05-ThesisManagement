"use strict";
import { getAllDegrees } from "../services/degree.services.js";

export const getDegrees = async (req, res) => {
  try {
    const result = await getAllDegrees();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
