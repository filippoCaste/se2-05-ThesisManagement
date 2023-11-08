import cors from "cors";
import express from "express";
import { router as userRoutes } from "./src/routes/user.route.js";
import { router as sessionRoutes } from "./src/routes/session.route.js";
import { router as proposalRoutes } from "./src/routes/proposal.route.js";
import { router as degreeRoutes } from "./src/routes/degree.route.js";
import { router as teacherRoutes } from "./src/routes/teacher.route.js";
import { router as groupRoutes } from "./src/routes/group.route.js";


import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import { strategy } from "./src/config/configs.js";

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

passport.use(strategy);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { _expires: 60000000, maxAge: 60000000 },
  })
);
app.use(passport.authenticate("session"));

app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
