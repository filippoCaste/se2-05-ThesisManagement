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
import { router as careerRoutes } from "./src/routes/career.route.js";
import { getUserByEmail } from "./src/services/user.services.js";
import { getStudentById } from "./src/services/student.services.js";
import { getTeacherById } from "./src/services/teacher.services.js";
import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import {strategy} from "./src/config/configs.js";
import { Student } from "./src/models/Student.js";
import { Teacher } from "./src/models/Teacher.js";
import { initScheduledJobs } from "./src/cron-jobs.js"


passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
  let user = await getUserByEmail(email);
  
  if(user.role == 'student')
    user = Student.fromResult(await getStudentById(user.id));
  else if(user.role == 'teacher')
    user = Teacher.fromTeachersResult(await getTeacherById(user.id));
  else if(user.role !== 'secretary')
    done(err, null);
  
  done(null, user);
});

const app = express();
const port = 3001;
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("students_CV"));

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
app.use(passport.authenticate('session'));
app.use(morgan("dev"));

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
app.use("/api/careers", careerRoutes);

// initialize cron jobs
initScheduledJobs();
app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});

export { app };
