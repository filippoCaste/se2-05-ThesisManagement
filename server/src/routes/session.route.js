import { Router } from "express";
import { getUserById } from "../services/user.services.js";

const router = Router();

// GET /api/session/current
router.get("/current", async (req, res) => {
  if (req.isAuthenticated())
    res.status(200).json(await getUserById(req.user.substring(1, req.user.length)));
  else 
    res.status(401).json({ error: "Not authenticated" });
});

export { router };
