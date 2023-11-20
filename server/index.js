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
import { router as applicationRoutes } from "./src/routes/application.route.js";
import { getUserById } from "./src/services/user.services.js";
import { getStudentById } from "./src/services/student.services.js";
import { getTeacherById } from "./src/services/teacher.services.js";
import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import {strategy} from "./src/config/configs.js";

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

passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  let user = await getUserById(id.slice(1));
  if(user.role == 'student')
    user = await getStudentById(user.id);
  else if(user.role == 'teacher')
    user = await getTeacherById(user.id);
  else 
    done(err, null);

  done(null, user);
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
app.use("/api/applications", applicationRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});

export { app };
