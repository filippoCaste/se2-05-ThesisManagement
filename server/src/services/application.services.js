import { db } from "../config/db.js";
import { Student } from "../models/Student.js";
import { getProposalInfoByID } from "./proposal.services.js";
import { Application } from "../models/Application.js";

export const createApplicationInDb = (
  proposal_id,
  student_id,
  submission_date
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await getStudentInfoByID(student_id);
      const proposal = await getProposalInfoByID(proposal_id);
      if (proposal.expiration_date < submission_date) {
        return reject({
          scheduledError: new Error(
            `Proposal with id ${proposal_id} has expired on ${proposal.expiration_date}`
          ),
        });
      }
      if (proposal.cod_degree.toString() !== student.cod_degree.toString()) {
        return reject({
          scheduledError: new Error(
            `Proposal and student cod_degree should match. Proposal with id ${proposal_id} has ` +
              `cod_degree ${proposal.cod_degree}, but student has cod_degree ${student.cod_degree}`
          ),
        });
      }
      if (proposal.expiration_date < submission_date) {
        return reject({
          scheduledError: new Error(
            `Proposal with id ${proposal_id} has expired on ${proposal.expiration_date}`
          ),
        });
      }
      const sql = `INSERT INTO Applications (proposal_id, student_id, submission_date) VALUES (?, ?, ?)`;
      db.run(sql, [proposal_id, student_id, submission_date], function (err) {
        if (err) {
          return reject(err);
        }
        const application = new Application(
          this.lastID,
          proposal_id,
          student_id,
          "submitted",
          submission_date
        );
        resolve(application.serialize());
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getStudentInfoByID = (student_id) => {
  const studentSearchSQL = `SELECT id,
        name, 
        surname, 
        gender, 
        nationality, 
        email, 
        cod_degree, 
        enrollment_year 
    FROM Students 
    WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.all(studentSearchSQL, [student_id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      if (rows.length === 0) {
        return reject({
          scheduledError: new Error(`Student with id ${student_id} not found`),
        });
      }
      resolve(Student.fromResult(rows[0]));
    });
  });
};

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