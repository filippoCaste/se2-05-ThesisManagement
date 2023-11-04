import { Router } from "express";
import passport from "passport";
import { createUserAndLogin, login } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", createUserAndLogin);
router.post("/login", login);

// GET /api/session/current
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
router.delete("/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

export { router };
