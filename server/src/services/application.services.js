import { db } from "../config/db.js";
import { Student } from "../models/Student.js";
import { getProposalInfoByID } from "./proposal.services.js";
import { Application } from "../models/Application.js";
import { getExtraInfoFromProposal } from "./proposal.services.js";

export const createApplicationInDb = async (
  proposal_id,
  student_id,
  submission_date
) => {
  const student = await getStudentInfoByID(student_id);
  const proposal = await getProposalInfoByID(proposal_id);
  if (proposal.expiration_date < submission_date) {
    throw new Error(
        `Proposal with id ${proposal_id} has expired on ${proposal.expiration_date}`
      );
    }
  if (proposal.cod_degree.toString() !== student.cod_degree.toString()) {
    throw new Error(
        `Proposal and student cod_degree should match. Proposal with id ${proposal_id} has ` +
        `cod_degree ${proposal.cod_degree}, but student has cod_degree ${student.cod_degree}`
      )
    }
  if (proposal.expiration_date < submission_date) {
    throw new Error(
        `Proposal with id ${proposal_id} has expired on ${proposal.expiration_date}`
      )
    }

  return new Promise((resolve, reject) => {
    
    try {
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
                    application_id: e.application_id,
                    status: e.status,
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
};

/**
 * This function updates the status of an application:
 *  - if the status is 'rejected' then only the application with the corresponding application_id is updated
 *  - if the status is 'accepted', all the others applications to the same proposal are set to 'rejected'
 * @param {*} applicationId 
 * @param {*} userId 
 * @param {*} status - can be either 'accepted' or 'rejected'
 *  
 */
export const changeStatus = (applicationId, userId, status) => {
  return new Promise((resolve, reject) => {
    const sql1 = "SELECT s.supervisor_id, a.proposal_id FROM Supervisors s, Applications a WHERE a.application_id=? AND a.proposal_id=s.proposal_id";
    db.get(sql1, [applicationId], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        reject(404);
      } else if(userId != row.supervisor_id) {
        reject(403);
      }

      const proposalId = row.proposal_id;
      const sql2 = "SELECT application_id FROM Applications WHERE proposal_id=?";
      db.all(sql2, [proposalId], (err, rows) => {
        if(err) {
          reject(err);
        } else if(rows.length !== 0) {
          const sql3 = "UPDATE Applications SET status=? WHERE application_id=?";
          for(let elem of rows) {
            let appId = elem.application_id;
            if(appId == applicationId) {
              db.run(sql3, [status, applicationId], (err) => {
                if(err) {
                  reject(err);
                }
              })
            } else if (status === 'accepted') {
                db.run(sql3, ["canceled", appId], (err) => {
                  if(err) {
                    reject(err);
                  }
                })
              }
          }
          if (status === 'accepted') {
            const sql4 = "UPDATE Proposals SET status=? WHERE id=?;";
            db.run(sql4, ["assigned", proposalId], (err) => {
              if (err) {
                reject(err);
              }
            })
          }
        }
        resolve(true);
      })
    });
  });
}

export const getApplicationsByStudentId = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT 
    a.application_id AS id,
    p.title,
    p.description,
    p.expiration_date,
    p.cod_degree,
    d.title_degree,
    p.level,
    s.supervisor_id,
    p.notes,
    p.cod_group,
    g.title_group,
    p.required_knowledge,
    s.supervisor_id,
    s.co_supervisor_id,
    s.external_supervisor,
    group_concat(k.name) as keyword_names,
    group_concat(k.type) as keyword_types,
    a.status AS application_status
      FROM Proposals AS p
      LEFT JOIN ProposalKeywords AS pk ON p.id = pk.proposal_id
      LEFT JOIN Keywords AS k ON k.id = pk.keyword_id
      LEFT JOIN Supervisors AS s ON s.proposal_id = p.id
      LEFT JOIN Degrees AS d ON p.cod_degree = d.cod_degree
      LEFT JOIN Groups AS g ON p.cod_group = g.cod_group
      LEFT JOIN Applications AS a ON p.id = a.proposal_id
      WHERE a.student_id = ? 
      GROUP BY p.id, a.application_id
      ORDER BY expiration_date ASC;`;

    db.all(sql, [studentId], async (err, rows) => {
      if (err) {
        return reject(err);
      }

      const applications = [];

      for (const row of rows) {
        const supervisorsInfo = await getExtraInfoFromProposal(row);

        const application = {
          id: row.id,
          title: row.title,
          description: row.description,
          expiration_date: row.expiration_date,
          cod_degree: row.cod_degree,
          title_degree: row.title_degree,
          level: row.level,
          supervisor_id: row.supervisor_id,
          notes: row.notes,
          cod_group: row.cod_group,
          title_group: row.title_group,
          required_knowledge: row.required_knowledge,
          keyword_names: row.keyword_names,
          keyword_types: row.keyword_types,
          status: row.application_status // Corrected alias name
        };

        application.supervisorsInfo = supervisorsInfo;
        applications.push(application);
      }

      resolve(applications);
    });
  });
};

export const getStudentEmailByApplicationId = (applicationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT Students.email
      FROM Applications
      JOIN Students ON Applications.student_id = Students.id
      WHERE Applications.application_id = ?;
    `;

    db.get(sql, [applicationId], (err, row) => {
      if (err) {
        return reject(err);
      }

      if (row && row.email) {
        resolve(row.email);
      } else {
        reject("No email were found"); // Return null if email not found for the applicationId
      }
    });
  });
};
