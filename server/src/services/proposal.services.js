import dayjs from 'dayjs';
import { db } from '../config/db.js';

export const getProposalsFromDB = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Proposals';
    db.all(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

export const getKeyWordsFromDB = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name FROM Keywords WHERE type="KEYWORD"';
    db.all(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

/**
 * 
 * @param {*} title 
 * @param {*} type 
 * @param {*} description 
 * @param {*} level 
 * @param {*} expiration_date 
 * @param {*} notes 
 * @param {*} cod_degree 
 * @param {*} cod_group 
 * @param {*} required_knowledge 
 * @param {*} supervisor_obj containing fields: supervisor_id, co_supervisor_id, external_supervisor
 * @returns 
 */
export const postNewProposal = (title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge, supervisor_obj) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        const date = dayjs(expiration_date).format();
        const sqlProp = db.prepare("INSERT INTO Proposals(title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge) VALUES (?,?,?,?,?,?,?,?,?);");
        sqlProp.run(title, type, description, level, date, notes, cod_degree, cod_group, required_knowledge);
        sqlProp.finalize();

        const sqlSuper = db.prepare("INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor) VALUES(?,?,?,?);");
        const sqlLast = db.prepare("SELECT id FROM Proposals ORDER BY id DESC LIMIT 1");
        sqlLast.get( function(err, row) {
          if (err) {
            reject(err);
          }
          sqlSuper.run(row.id, supervisor_obj.supervisor_id, supervisor_obj.co_supervisor_id || null, supervisor_obj.external_supervisor_id || null)
          sqlSuper.finalize();
          return true;
        })
        sqlLast.finalize();

      })
      resolve(true);
    } catch(err) {
      reject(err)
    }
    // const sql = "BEGIN TRANSACTION; " +
    // "SELECT last_insert_rowid() AS proposal_id_last;" +
    // "INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor)" +
    // "VALUES(proposal_id_last,?,?,?);" +
    // "COMMIT TRANSACTION;"

    // const date = dayjs(expiration_date).format();
    // db.run(sql, [title, type, description, level, date, notes, cod_degree, cod_group, required_knowledge, supervisor_obj.supervisor_id, 
    //                 supervisor_obj.co_supervisor_id, supervisor_obj.external_supervisor_id], (err) => {
    //   if(err) {
    //     reject(err)
    //   } else {
    //     resolve(true);
    //   }
    // })
  })
}
