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
