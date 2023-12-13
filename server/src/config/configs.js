import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import passportSaml from 'passport-saml';
const { Strategy: SamlStrategy } = passportSaml;
import { getUserById } from '../services/user.services.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const strategy = new SamlStrategy({
  entryPoint: 'https://thesis-management-05.eu.auth0.com/samlp/aLJmcMkDJkpc8Rql8EfxLVl4ND9aUyWp',
  issuer: 'urn:thesis-management-05.eu.auth0.com',
  callbackUrl: 'http://localhost:3001/api/users/login/callback',
  cert: fs.readFileSync(path.join(__dirname, '../../cert.pem'), 'utf8'),
  acceptedClockSkewMs: 30000
}, 
function (profile, done) {
  return done(null, {
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      nickname: profile['http://schemas.auth0.com/nickname'],
  });
});

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../students_CV');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `s${req.params.studentId}_${req.params.applicationId}_CV${fileExtension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const upload = multer({ 
  storage: storage, 
  limits: { 
    fileSize: 1024 * 1024 * 5, 
    fieldSize: 2 * 1024 * 1024,
    parts: 10, 
    headerPairs: 20 
  }, 
  fileFilter: fileFilter 
});