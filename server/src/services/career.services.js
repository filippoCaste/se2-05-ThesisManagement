import { db } from "../config/db.js";

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