import { db } from '../config/db.js';

export const getApplicationsByProposalId = (proposalId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Applications A, Students S, Degrees D WHERE A.proposal_id = ? AND S.id = A.student_id AND S.cod_degree = D.cod_degree ';
        db.all(sql, [proposalId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            const applications = rows.map((e) => {
                const obj = {
                    student_id: e.student_id,
                    submission_date: e.submission_date,
                    student_name: e.name,
                    student_surname: e.surname,
                    student_email: e.email,
                    student_nationality: e.nationality,
                    student_enrollment_year: e.enrollment_year,
                    student_title_degree: e.title_degree
                }
                return obj;
            });
            resolve (applications);
        });
    });
}