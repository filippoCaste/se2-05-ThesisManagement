import { Router } from "express";
import passport from "passport";
import { getUserById } from "../services/user.services.js";

const router = Router();

router.get('/login', (req, res, next) => {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    }
    )(req, res, next);
  });
  
router.get('/login/callback', (req, res, next) => {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.logIn(user, async function (err) {
            if (err) { return next(err); }
            const userData = await getUserById(user.nickname.slice(1));
            return res.redirect("http://localhost:5173/" + userData.role);
        });
    }
    )(req, res, next);
  }
  );
  
router.get('/logout', (req, res) => {
    req.logOut(res, function (err) {
        if (err) { return next(err); }
  
        const redirectURL = "http://localhost:5173/";
        return res.redirect(redirectURL);
    });
  });

export { router };