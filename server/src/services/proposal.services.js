import dayjs from 'dayjs';
import { db } from "../config/db.js";
import { Proposal } from "../models/Proposal.js";
import { Teacher } from "../models/Teacher.js";

export const getProposalsFromDB = (
  cod_degree,
  level_ids,
  keyword_ids,
  supervisor_id,
  start_date,
  end_date
) => {
  return new Promise((resolve, reject) => {
    var levels = "";
    var keywords = "";
    var supervisor = "";
    if (level_ids && level_ids.length > 0) {
      levels = ` AND level IN (${level_ids.map(() => "?").join(",")})`;
    }
    if (keyword_ids && keyword_ids.length > 0) {
      keywords = ` AND pk.keyword_id IN (${keyword_ids
        .map(() => "?")
        .join(",")})`;
    }
    if (supervisor_id) {
      supervisor = ` AND s.supervisor_id=?`;
    }
    // consider cases where there is only start_date or end_date or both
    var date = "";
    if (start_date && end_date) {
      date = ` AND (expiration_date BETWEEN ? AND ?)`;
    } else if (start_date) {
      date = ` AND expiration_date >= '${start_date}'`;
    } else if (end_date) {
      date = ` AND expiration_date <= '${end_date}''`;
    }

    const sql = `
    SELECT p.id,
        p.title,
        p.description,
        p.expiration_date,
        p.cod_degree,
        p.level,
        p.notes,
        p.cod_group,
        p.required_knowledge,
        s.supervisor_id,
        s.co_supervisor_id,
        s.external_supervisor,
        group_concat(k.type) as keyword_types,
        group_concat(k.name) as keyword_names
      FROM Proposals p
      LEFT JOIN ProposalKeywords pk ON p.id = pk.proposal_id
      LEFT JOIN Keywords k ON k.id = pk.keyword_id
      LEFT JOIN Supervisors s ON s.proposal_id = p.id
      WHERE p.expiration_date >= date('now')
        AND p.cod_degree = ?
        ${levels}
        ${keywords}
        ${supervisor}
        ${date}
      GROUP BY p.id
      ORDER BY expiration_date ASC;
    `;
    db.all(
      sql,
      [
        cod_degree,
        ...level_ids,
        ...keyword_ids,
        supervisor_id,
      ],
      async (err, rows) => {
        if (err) {
          return reject(err);
        }
        const returnObj = [];
        for (const row of rows) {
          const supervisorsInfo = await getExtraInfoFromProposal(row);
          const proposal = Proposal.fromProposalsResult(row);
          const serializedProposal = proposal.serialize();
          serializedProposal.supervisorsInfo = supervisorsInfo;
          returnObj.push(serializedProposal);
        }
        return resolve(returnObj);
      }
    );
  });
};

export const getExtraInfoFromProposal = (proposal) => {
  return new Promise((resolve, reject) => {
    const supervisors = [];
    const sql = `
    SELECT id, name, email, cod_department, cod_group
    FROM Teachers
    WHERE id IN (?, ?, ?)
  `;
    db.all(
      sql,
      [
        proposal.supervisor_id,
        proposal.co_supervisor_id,
        proposal.external_supervisor,
      ],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        for (const row of rows) {
          supervisors.push(Teacher.fromTeachersResult(row));
        }
        resolve(supervisors);
      }
    );
  });
};

export const getKeyWordsFromDB = (proposal_id) => {
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
