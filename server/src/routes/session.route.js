import { Router } from "express";

const router = Router();

// GET /api/session/current
router.get("/current", async (req, res) => {
  if (req.isAuthenticated()) 
    res.status(200).json(req.user);
  else 
    res.status(401).json({ error: "Not authenticated" });
});

export { router };
