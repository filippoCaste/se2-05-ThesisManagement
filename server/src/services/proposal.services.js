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
 * @param {*} required_knowledge - a string
 * @param {*} supervisor_obj - an object containing fields: supervisor_id, co_supervisor_id, external_supervisor
 * @returns 
 */
export const postNewProposal = (title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge, supervisor_obj, keywords) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        const date = dayjs(expiration_date).format();
        const sqlProp = db.prepare("INSERT INTO Proposals(title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge) VALUES (?,?,?,?,?,?,?,?,?);");
        sqlProp.run(title, type, description, level, date, notes, cod_degree, cod_group, required_knowledge);
        sqlProp.finalize();

        const sqlKeyw = db.prepare("INSERT INTO ProposalKeywords(proposal_id, keyword_id) VALUES (?,?)");
        const sqlGetKeyw = db.prepare("SELECT id FROM Keywords WHERE name = ?");

        const sqlSuper = db.prepare("INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor) VALUES(?,?,?,?);");
        const sqlLast = db.prepare("SELECT id FROM Proposals ORDER BY id DESC LIMIT 1");
        sqlLast.get( function(err, row) {
          if (err) {
            reject(err);
          }
          const propId = row.id;
          if (supervisor_obj.co_supervisors && supervisor_obj.co_supervisors.length>0) {
            for (let id of supervisor_obj.co_supervisors) {
              sqlSuper.run(propId, supervisor_obj.supervisor_id, id || null, supervisor_obj.external_supervisor_id || null)
            }
            sqlSuper.finalize();
          }

          for (let kw of keywords) {
            sqlGetKeyw.get( kw, (err, row) => {
              if (err) {
                reject(err);
              } else {
                if (row.id) {
                  sqlKeyw.run(propId, row.id);
                  sqlKeyw.finalize();
                }
              }
            })
            sqlGetKeyw.finalize();
          }

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
