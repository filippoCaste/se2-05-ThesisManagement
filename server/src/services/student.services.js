import { db } from '../config/db.js';

export const getStudentById = (studentId) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Students WHERE id = ?";
        db.get(sql, [studentId], (err, row) => {
            if (err) {
                reject(err);
            }
            if(row) {
                const student = {
                    id: row.id,
                    name: row.name,
                    surname: row.surname,
                    gender: row.gender,
                    nationality: row.nationality,
                    email: row.email,
                    cod_degree: row.cod_degree,
                    enrollment_year: row.enrollment_year
                };
                resolve(student);
            } else {
                resolve(undefined)
            }
        });
    });
}
