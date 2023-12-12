import { db } from '../config/db.js';

export const createProposalRequest = async (
  student_id,
  teacher_id,
  co_supervisors_ids,
  title,
  description,
  notes
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ProposalRequests 
        (student_id, teacher_id, title, description, notes, type) 
        VALUES (?, ?, ?, ?, ?, 'submitted')`;
    db.run(
      sql,
      [student_id, teacher_id, title, description, notes],
      function (err) {
        if (err) {
          console.log("Error in first query")
          reject(err);
        }

        if (co_supervisors_ids && co_supervisors_ids.length > 0) {
          const sql2 = `INSERT INTO ProposalRequestCoSupervisors 
                        (proposal_request_id, co_supervisor_id) 
                        VALUES (?, ?)`;
          for (let id of co_supervisors_ids) {
            db.run(sql2, [this.lastID, id], (err) => {
              if (err) {
                console.log("Error in the second query")
                reject(err);
              }
            });
          }
        }
        resolve({
            id: this.lastID,
            student_id: student_id,
            teacher_id: teacher_id,
            co_supervisors_ids: co_supervisors_ids,
            title: title,
            description: description,
            notes: notes,
            type: "submitted",
        });
      }
    );
  });
};
