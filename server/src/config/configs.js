import LocalStrategy from "passport-local";
import { verifyUser } from "../services/user.services.js";

export const strategy = new LocalStrategy(async function verify(
  username,
  password,
  callback
) {
  const user = await verifyUser(username, password);
  if (!user) return callback(null, false, "Incorrect username or password.");

  return callback(null, user);
});

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};
