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

export const getStudentCV = (studentId, applicationId) => {
  const fileName = `s${studentId}_${applicationId}_CV.pdf`;
  const filesFolder = path.join(process.cwd(), 'students_CV');

  return new Promise((resolve, reject) => {
      fs.readdir(filesFolder, (err, files) => {
          if (err) {
              reject(err);
          } else {
              const fileUrl = files.filter(file => file.includes(fileName)).map(file => `http://localhost:3001/${file}`);
              if (fileUrl.length !== 0) {
                  resolve({ fileUrl: fileUrl[0] });
              } else {
                  resolve(null);
              }
          }
      });
  });
};
