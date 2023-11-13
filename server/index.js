import cors from "cors";
import express from "express";
import { router as userRoutes } from "./src/routes/user.route.js";
import { router as sessionRoutes } from "./src/routes/session.route.js";
import { router as proposalRoutes } from "./src/routes/proposal.route.js";
import { router as degreeRoutes } from "./src/routes/degree.route.js";
import { router as teacherRoutes } from "./src/routes/teacher.route.js";
import { router as groupRoutes } from "./src/routes/group.route.js";
import { router as studentRoutes } from "./src/routes/student.route.js";
import { router as keywordRoutes } from "./src/routes/keyword.route.js";
import { router as levelRoutes } from "./src/routes/level.route.js";
import { getTeacherById } from './src/services/teacher.services.js';
import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import auth0Strategy from "passport-auth0";
import jwt from "jsonwebtoken";

passport.use(new auth0Strategy({
  domain: 'thesis-management-05.eu.auth0.com',
  clientID: 'aLJmcMkDJkpc8Rql8EfxLVl4ND9aUyWp',
  clientSecret: 'ZNqGAzme8S6TBGJ_rMB3NfcAJgZnCikGWRB0nCkswCwjWQ7oacFDh3D_gHVYmaOj',
  callbackURL: 'http://localhost:3001/login/callback',
  scope: 'openid profile email',
  credentials: true
},
  function (accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile.nickname);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
          done(null, user);
});

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { _expires: 60000000, maxAge: 60000000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res, next) => {
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

app.get('/login/callback', (req, res, next) => {
  passport.authenticate('auth0', function (err, user, info) {
      if (err) return next(err);
      if (!user) return res.redirect('/login');
      req.logIn(user, async function (err) {
          if (err) { return next(err); }

          const userData = await getTeacherById(user.substring(1, user.length));

          if (userData === undefined)
              return next(err);

          const token = jwt.sign(userData, "my_secret_key");

          const redirectURL = "http://localhost:5173/teacher?token=" + token;
          return res.redirect(redirectURL);
      });
  }
  )(req, res, next);
}
);

app.get('/logout', (req, res) => {
  req.logOut(res, function (err) {
      if (err) { return next(err); }

      const redirectURL = "http://localhost:5173/";
      return res.redirect(redirectURL);
  });
});

app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/levels", levelRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});

export { app };
