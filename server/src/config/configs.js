import auth0Strategy from 'passport-auth0';
import { getUserById } from '../services/user.services.js';

export const strategy = new auth0Strategy({
  domain: 'thesis-management-05.eu.auth0.com',
  clientID: 'aLJmcMkDJkpc8Rql8EfxLVl4ND9aUyWp',
  clientSecret: 'ZNqGAzme8S6TBGJ_rMB3NfcAJgZnCikGWRB0nCkswCwjWQ7oacFDh3D_gHVYmaOj',
  callbackURL: 'http://localhost:3001/api/users/login/callback',
  scope: 'openid profile email',
  credentials: true
},
  function (accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile);
  }
);

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

export const isStudent = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await getUserById(req.user.id);
    if (user.role === "student") {
      return next();
    }
  }
  return res.status(401).json({ error: "Not authorized" });
};

export const isTeacher = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await getUserById(req.user.id);
    if (user.role === "teacher") {
      return next();
    }
  }
  return res.status(401).json({ error: "Not authorized" });
};