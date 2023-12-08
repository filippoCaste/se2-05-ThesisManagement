import { db } from "../config/db.js";
import fs from "fs";
import path from "path";

export const getStudentCareer = (studentId) => {
    const sql = `SELECT * FROM Careers WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.all(sql, [studentId], (err, rows) => {
        if (err) {
            return reject(err);
        }
        resolve(rows);
        });
    });
};

const getDirname = importMetaUrl => {
    const __filename = new URL(importMetaUrl).pathname;
    return path.dirname(__filename);
};

export const getStudentCV = (studentId, proposalId) => {
    const fileName = `s${studentId}_${proposalId}_CV.pdf`;
    const currentModuleDir = getDirname(import.meta.url);
    const filesFolder = path.join(currentModuleDir, `../../public/students_CV/`);
  
    return new Promise((resolve, reject) => {
        let obj = { fileExists : false };
      fs.readdir(filesFolder, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const fileUrl = files.map(file => `http://localhost:3001/students_CV/${file}`);
          const file = fileUrl.filter(file => file.includes(fileName));
          if (file.length !== 0) {
            obj = { fileExists : true, fileUrl: file[0] };
          }
          resolve(obj);
        }
      });
    });
};