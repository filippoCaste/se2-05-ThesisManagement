import dayjs from "dayjs";
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
    const params = [];
    var levels = "";
    var keywords = "";
    var supervisor = "";
    var cod_degree_condition = "";
    if (level_ids && level_ids.length > 0) {
      levels = ` AND level IN (${level_ids.map(() => "?").join(",")})`;
      params.push(...level_ids);
    }
    if (keyword_ids && keyword_ids.length > 0) {
      keywords = ` AND pk.keyword_id IN (${keyword_ids
        .map(() => "?")
        .join(",")})`;
      params.push(...keyword_ids);
    }
    if (supervisor_id) {
      supervisor = ` AND s.supervisor_id=?`;
      params.push(supervisor_id);
    }
    if (cod_degree) {
      cod_degree_condition = "AND p.cod_degree = ?";
      params.push(cod_degree);
    }
    // consider cases where there is only start_date or end_date or both
    var date = "";
    if (start_date && end_date) {
      date = ` AND (p.expiration_date BETWEEN ? AND ?)`;
      params.push(start_date, end_date);
    } else if (start_date) {
      date = ` AND p.expiration_date >= ?`;
      params.push(start_date);
    } else if (end_date) {
      date = ` AND p.expiration_date <= ?`;
      params.push(end_date);
    }

    const sql = `
    SELECT p.id,
        p.title,
        p.description,
        p.expiration_date,
        p.cod_degree,
        d.title_degree,
        p.level,
        p.notes,
        p.cod_group,
        g.title_group,
        p.required_knowledge,
        s.supervisor_id,
        s.co_supervisor_id,
        s.external_supervisor,
        group_concat(k.type) as keyword_types,
        group_concat(k.name) as keyword_names
      FROM Proposals AS p
      LEFT JOIN ProposalKeywords AS pk ON p.id = pk.proposal_id
      LEFT JOIN Keywords AS k ON k.id = pk.keyword_id
      LEFT JOIN Supervisors AS s ON s.proposal_id = p.id
      LEFT JOIN Degrees AS d ON p.cod_degree = d.cod_degree
      LEFT JOIN Groups AS g ON p.cod_group = g.cod_group
      WHERE p.expiration_date >= date('now')
        ${levels}
        ${keywords}
        ${supervisor}
        ${cod_degree_condition}
        ${date}
      GROUP BY p.id
      ORDER BY expiration_date ASC;
    `;
    db.all(sql, params, async (err, rows) => {
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
    });
  });
};

export const getExtraInfoFromProposal = (proposal) => {
  return new Promise((resolve, reject) => {
    const supervisors = [];
    const sql = `
    SELECT id, name,surname, email, cod_department, cod_group
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

export const getProposalInfoByID = (proposal_id) => {
  return new Promise((resolve, reject) => {
    const proposalSearchSQL = `SELECT id,
          title, 
          description, 
          expiration_date, 
          cod_degree, 
          level, 
          notes, 
          cod_group, 
          required_knowledge 
      FROM Proposals 
      WHERE id = ?;`;
    db.all(proposalSearchSQL, [proposal_id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      if (rows.length === 0) {
        return reject({
          scheduledError: new Error(`Proposal with id ${proposal_id} not found`),
        });
      }
      resolve(Proposal.fromProposalsResult(rows[0]));
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
export const postNewProposal = (
  title,
  type,
  description,
  level,
  expiration_date,
  notes,
  cod_degree,
  cod_group,
  required_knowledge,
  supervisor_obj,
  keywords
) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        const date = dayjs(expiration_date).format();
        const sqlProp = db.prepare(
          "INSERT INTO Proposals(title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge) VALUES (?,?,?,?,?,?,?,?,?);"
        );
        sqlProp.run(
          title,
          type,
          description,
          level,
          date,
          notes,
          cod_degree,
          cod_group,
          required_knowledge
        );
        sqlProp.finalize();

        const sqlKeyw = db.prepare(
          "INSERT INTO ProposalKeywords(proposal_id, keyword_id) VALUES (?,?)"
        );
        const sqlGetKeyw = db.prepare("SELECT id FROM Keywords WHERE name = ?");

        const sqlSuper = db.prepare(
          "INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor) VALUES(?,?,?,?);"
        );
        const sqlLast = db.prepare(
          "SELECT id FROM Proposals ORDER BY id DESC LIMIT 1"
        );
        sqlLast.get(function (err, row) {
          if (err) {
            reject(err);
          }
          const propId = row.id;
          if (
            supervisor_obj.co_supervisors &&
            supervisor_obj.co_supervisors.length > 0
          ) {
            for (let id of supervisor_obj.co_supervisors) {
              sqlSuper.run(
                propId,
                supervisor_obj.supervisor_id,
                id || null,
                supervisor_obj.external_supervisor_id || null
              );
            }
            sqlSuper.finalize();
          }

          for (let kw of keywords) {
            sqlGetKeyw.get(kw, (err, row) => {
              if (err) {
                reject(err);
              } else {
                if (row.id) {
                  sqlKeyw.run(propId, row.id);
                  sqlKeyw.finalize();
                }
              }
            });
            sqlGetKeyw.finalize();
          }

          return true;
        });
        sqlLast.finalize();
      });
      resolve(true);
    } catch (err) {
      reject(err);
    }
  })
}

export const getProposalsByTeacherId = (teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * " +
                " FROM Proposals p, Groups g, Degrees d" +
                " WHERE p.id IN(SELECT proposal_id FROM Supervisors WHERE supervisor_id = ? OR co_supervisor_id = ?) AND " +
                "g.cod_group = p.cod_group AND d.cod_degree = p.cod_degree ";
    db.all(sql, [teacherId, teacherId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const proposals = rows.map((e) => {
        const obj = {
          id: e.id,
          title: e.title,
          description: e.description,
          type: e.type,
          level: e.level,
          expiration_date: e.expiration_date,
          notes: e.notes,
          cod_degree: e.cod_degree,
          cod_group: e.cod_group,
          required_knowledge: e.required_knowledge,
          status: e.status,
          title_degree: e.title_degree,
          title_group: e.title_group,
        }
        return obj;
      });
      resolve(proposals);
    });
  });
}

export const updateProposalByProposalId = (proposalId, userId, proposal) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT supervisor_id, proposal_id FROM Supervisors WHERE proposal_id = ?';
    db.get(sql1, [proposalId], (err, row) => {
      if (err)
        reject(err);
      else if (!row)
        reject(404);
      else if (row.supervisor_id != userId) {
        reject(403);
      } else {

        // update the proposal data
        const sql2 = "UPDATE Proposals SET title = ?, type=?, description=?, level=?, expiration_date=?, notes=?, cod_group=?, required_knowledge=? " +
                      " WHERE id = ? AND cod_degree = ?";
        // const sql2a = "SELECT * FROM Proposals WHERE id = ? AND cod_degree = ?";

        for(let degree of proposal.cod_degree) {
          db.run(sql2, [proposal.title, proposal.type, proposal.description, proposal.level, proposal.expiration_date, proposal.notes||'', proposal.cod_group, proposal.required_knowledge||'', proposalId, degree], (err) => {
            if(err) {
              reject(err)
            }
          })
        }

        // update the supervisors table (if there are new ones)
        const sql4a = "SELECT * FROM Supervisors s WHERE s.proposal_id = ? AND co_supervisor_id = ? ;";
        const sql4b = "INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id) VALUES (?,?,?) ;";

        for (let coSup of proposal.supervisors_obj.co_supervisors) {
          db.get(sql4a, [proposalId, coSup], (err, row) => {
            if (err) {
              reject(err)
            } else {
              if (!row) {
                db.run(sql4b, [proposalId, userId, coSup], (err) => {
                  if (err) {
                    reject(err);
                  }
                })
              }
            }
          })
        }


        // update the keywords (if there are new ones)
        const sql3a = "SELECT pk.keyword_id as keywordId FROM ProposalKeywords pk, Keywords k WHERE pk.proposal_id = ? AND pk.keyword_id = k.id AND k.name = ?;";
        const sql3b = "INSERT INTO ProposalKeywords(proposal_id, keyword_id) VALUES (?,?) ;"
        const sql3c = "SELECT * FROM Keywords WHERE name = ?"

        for(let kw of proposal.keywords) {
          db.get(sql3a, [proposalId, kw], (err, row) => {
            if(err) {
              reject(err);
            }
            if(!row) {
              db.get(sql3c, [kw], (err, row) => {
                if(err) {
                  reject(err)
                }
                db.run(sql3b, [proposalId, row.id], (err) => {
                  if (err) {
                    reject(err);
                  }
                })
              })
            }
          })
        }

        resolve(true);
      }
    })
  })

}

