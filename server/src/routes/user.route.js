import { Router } from "express";
import passport from "passport";
import { getUserByEmail } from "../services/user.services.js";
import bodyParser from "body-parser";

const router = Router();

router.get('/login', (req, res, next) => {
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true })(req, res, next);
});

router.post('/login/callback', bodyParser.urlencoded({ extended: false }), (req, res, next) => {
    if (!req.isAuthenticated()){
        passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }, async function (err, user, info) {
            if (err)
                return next(err);

            if (!user)
                return res.redirect('/login');

                req.logIn(user, async function (err) {
                    if (err) { return next(err); }
                    const userData = await getUserByEmail(user.email);
                    return res.redirect("http://localhost:5173/" + userData.role);
                });
        })(req, res, next);
    }else
        res.redirect('http://localhost:5173');
});
  
router.get('/logout', (req, res) => {
    req.logOut(res, function (err) {
        if (err) { return next(err); }
  
        const redirectURL = "http://localhost:5173/";
        return res.redirect(redirectURL);
    });
  });

export { router };