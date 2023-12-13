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
    let levels = "";
    let keywords = "";
    let supervisor = "";
    let cod_degree_condition = "";
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
    let date = "";
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
        group_concat(DISTINCT k.name) as keyword_names
      FROM Proposals AS p
      LEFT JOIN ProposalKeywords AS pk ON p.id = pk.proposal_id
      LEFT JOIN Keywords AS k ON k.id = pk.keyword_id
      LEFT JOIN Supervisors AS s ON s.proposal_id = p.id
      LEFT JOIN Degrees AS d ON p.cod_degree = d.cod_degree
      LEFT JOIN Groups AS g ON p.cod_group = g.cod_group
      WHERE p.expiration_date >= date('now') AND p.status != 'accepted'
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
        const date = dayjs(expiration_date).format("YYYY-MM-DD");
        const sqlProp = "INSERT INTO Proposals(title, type, description, level, expiration_date, notes, cod_degree, cod_group, required_knowledge) VALUES (?,?,?,?,?,?,?,?,?);"
        db.run(sqlProp, [
          title,
          type,
          description,
          level,
          date,
          notes || '',
          cod_degree,
          cod_group,
          required_knowledge
        ], (err) => {
          if(err) {
            reject(err);
          } else {
            const sqlKeyw = "INSERT INTO ProposalKeywords(proposal_id, keyword_id) VALUES (?,?)"
            const sqlGetKeyw = "SELECT id FROM Keywords WHERE name = ?"

            const sqlGetExtSup = "SELECT id, name, surname, email FROM ExternalUsers WHERE email=? AND name=? AND surname=?";
            const sqlGetExtSup2 = "SELECT id, name, surname, email FROM ExternalUsers WHERE email=? AND name=? AND surname=?"
            const sqlInsertExtSup = "INSERT INTO ExternalUsers(email, name, surname) VALUES (?,?,?)";
            const sqlSuper = "INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor) VALUES(?,?,?,?);"
            const sqlSuper2 = "INSERT INTO Supervisors(proposal_id, supervisor_id, co_supervisor_id, external_supervisor) VALUES(?,?,?,?);"
            const sqlLast = "SELECT id FROM Proposals WHERE cod_degree=? AND title=? ORDER BY id DESC LIMIT 1"
            
            db.get(sqlLast, [cod_degree, title], (err, row) => {
              if (err) {
                reject(err);
              }
              const propId = row.id;
              if (
                supervisor_obj.co_supervisors &&
                supervisor_obj.co_supervisors.length > 0
              ) {
                for (let c_id of supervisor_obj.co_supervisors) {
                  if (c_id !== supervisor_obj.supervisor_id) {
                    db.run(sqlSuper, [
                      propId,
                      supervisor_obj.supervisor_id,
                      c_id || null,
                      null
                    ], (err) => {
                      if (err) {
                        reject(err);
                      }
                    });
                  }
                }
              } 
              // if(supervisor_obj.co_supervisors.length == 0) {
                db.run(sqlSuper, [propId, supervisor_obj.supervisor_id, null, null], (err) => {
                  if(err) {
                    reject(err);
                  } else {
                    console.log("added supervisor")
                  }
                });
              // }

              if (supervisor_obj.external && supervisor_obj.external.length > 0) {
                for (let ext of supervisor_obj.external) {
                  db.get(sqlGetExtSup, [ext.email, ext.name, ext.surname], (err, row2) => {
                    if (err) {
                      reject(err);
                    }
                    if (!row2) {
                      // add external co_sup
                      db.run(sqlInsertExtSup, [ext.email, ext.name, ext.surname], (err) => {
                        if (err) {
                          reject(err);
                        } else {

                          db.get(sqlGetExtSup2, [ext.email, ext.name, ext.surname], (err, row3) => {
                            if (err) {
                              reject(err);
                            } else {
                              db.run(sqlSuper2, [propId, supervisor_obj.supervisor_id, null, row3.id], (err) => {
                                if (err) {
                                  reject(err);
                                }
                              });
                            }
                          })

                        }
                      });
                    } else {
                      db.run(sqlSuper2, [propId, supervisor_obj.supervisor_id, null, row2.id], (err) => {
                        if (err) {
                          reject(err);
                        }
                      });
                    }
                  })
                }
              }

              for (let kw of keywords) {
                db.get(sqlGetKeyw, kw, (err, row4) => {
                  if (err) {
                    reject(err);
                  } else {
                    if (row4.id) {
                      db.run(sqlKeyw, [propId, row4.id], (err) => {
                        if (err) {
                          reject(err);
                        }
                      });
                    }
                  }
                });
              }
              resolve(true);
            });
          }
        });

      });    
    } catch (err) {
      reject(err);
    }
  })
}

export const getProposalsByTeacherId = (teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * " +
                " FROM Proposals p, Groups g, Degrees d" +
                " WHERE p.id IN(SELECT proposal_id FROM Supervisors WHERE supervisor_id = ?) AND " +
                "g.cod_group = p.cod_group AND d.cod_degree = p.cod_degree ";
    db.all(sql, [teacherId], (err, rows) => {
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

export const deleteProposalById = (proposalId) => {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(function () {
        const keywordIds = []; // Array to store keyword IDs

        // SQL to retrieve keyword IDs associated with the proposal
        const sqlGetKeywordIds = db.prepare(
          "SELECT keyword_id FROM ProposalKeywords WHERE proposal_id = ?"
        );
        sqlGetKeywordIds.each(proposalId, (err, row) => {
          if (err) {
            reject(err);
          } else {
            keywordIds.push(row.keyword_id);
          }
        }, () => {
          // After retrieving keyword IDs, perform deletion
          const sqlDeleteKeywordsFromProposal = db.prepare(
            "DELETE FROM ProposalKeywords WHERE proposal_id = ?"
          );
          sqlDeleteKeywordsFromProposal.run(proposalId);
          sqlDeleteKeywordsFromProposal.finalize();

          const sqlDeleteSupervisors = db.prepare(
            "DELETE FROM Supervisors WHERE proposal_id = ?"
          );
          sqlDeleteSupervisors.run(proposalId);
          sqlDeleteSupervisors.finalize();

          const sqlDeleteApplications = db.prepare(
            "DELETE FROM Applications WHERE proposal_id = ?"
          );
          sqlDeleteApplications.run(proposalId);
          sqlDeleteApplications.finalize();

          const sqlDeleteProposal = db.prepare(
            "DELETE FROM Proposals WHERE id = ?"
          );
          sqlDeleteProposal.run(proposalId);
          sqlDeleteProposal.finalize();

          // Delete keywords that are not associated with any other proposal
          const sqlDeleteUnusedKeywords = db.prepare(`
            DELETE FROM Keywords 
            WHERE id IN (
              SELECT id FROM Keywords 
              WHERE id IN (${keywordIds.join(',')})
              AND id NOT IN (
                SELECT keyword_id FROM ProposalKeywords
              )
            )
          `);
          sqlDeleteUnusedKeywords.run();
          sqlDeleteUnusedKeywords.finalize();

          resolve(true); // Resolve with deleted keyword IDs
        });

        sqlGetKeywordIds.finalize();
      });
    } catch (err) {
      reject(err); // Something went wrong
    }
  });
};

export const getSupervisorByProposalId = (proposalId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT supervisor_id FROM Supervisors WHERE proposal_id = ? LIMIT 1";
    db.get(sql, [proposalId], (err, row) => {
      if (err) {
        return reject(err);
      }
      
      if (!row) {
        return reject(new Error("No supervisor found for the given proposal ID"));
      }

      resolve(row.supervisor_id);
    });
  });
};

export const archiveProposalByProposalId = (proposalId) => {
  return new Promise((resolve, reject) => {
    try {
      const sqlProposal = db.prepare('UPDATE proposals SET status = "archived" WHERE id = ?');
      const sqlApplications = db.prepare('UPDATE applications SET status = "rejected" WHERE proposal_Id = ?');

      sqlProposal.run(proposalId, function(errorProposal) {
        if (errorProposal) {
          console.error('Error updating proposal status:', errorProposal);
          reject(errorProposal);
          return;
        }

        sqlApplications.run(proposalId, function(errorApplications) {
          if (errorApplications) {
            console.error('Error updating applications status:', errorApplications);
            reject(errorApplications);
            return;
          }

          console.log('Proposal and related applications updated successfully.');
          resolve('Proposal and related applications archived.');
        });
      });
    } catch (err) {
      console.error('Error:', err);
      reject(err);
    }
  });
};

export const updateProposalByProposalId = (proposalId, userId, proposal) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT supervisor_id, proposal_id, status FROM Supervisors, Proposals WHERE proposal_id = ? AND id=proposal_id; ';
    db.get(sql1, [proposalId], (err, row) => {
      if (err)
        reject(err);
      else if (!row)
        reject(404);
      else if (row.supervisor_id != userId) {
        reject(403);
      } else if(row.status === 'assigned') {
        console.log("This proposal has been already assigned so it cannot be modified")
        reject(400);
      } else {

        // update the proposal data
        const sql2 = "UPDATE Proposals SET title = ?, type=?, description=?, level=?, expiration_date=?, notes=?, cod_group=?, required_knowledge=? " +
                      " WHERE id = ? AND cod_degree = ?";

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

export const getAllInfoByProposalId = (proposalId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Proposals p, Supervisors s, Groups g, Degrees d WHERE p.id=? AND p.id=s.proposal_id AND g.cod_group=p.cod_group AND d.cod_degree=p.cod_degree";
    db.get(sql, [proposalId], (err,row) => {
      if(err){
        reject(err)
      } else {
        if(!row) {
          reject(404);
        } else if(row.supervisor_id !== userId) {
          reject(403);
        } else {
          let proposalInfo = {
            id: row.id,
            title: row.title,
            description: row.description,
            type: row.type,
            level: row.level,
            expiration_date: row.expiration_date,
            notes: row.notes,
            cod_degree: row.cod_degree,
            required_knowledge: row.required_knowledge,
            status: row.status,
            title_degree: row.title_degree,
          };

          const sqlGroup = "SELECT * FROM Teachers t, Supervisors s, Groups g WHERE g.cod_group=t.cod_group AND s.co_supervisor_id=t.id AND s.proposal_id=?; "
          db.all(sqlGroup, [proposalId], (err, rows) => {
            if(err) {
              reject(err);
            } else {
              let groups = rows.map((g) => {
                return {cod_group: g.cod_group, title_group: g.title_group};
              })
              groups.push({cod_group: row.cod_group, title_group: row.title_group});
              proposalInfo = {...proposalInfo, groups}
            }
          });

          const sqlKw = "SELECT * FROM Keywords k, ProposalKeywords pk WHERE pk.proposal_id=? AND pk.keyword_id=k.id";
          db.all(sqlKw, proposalId, (err, rows) => {
            if(err) {
              reject(err)
            } else {
              let keywords = rows.map(k => {
                return k.name
              });
              proposalInfo = {...proposalInfo, keywords};

              // add cosupervisors
              const sqlSuper = "SELECT id, name, surname, email FROM Supervisors s, Teachers t WHERE s.proposal_id=? AND s.co_supervisor_id=t.id";
              db.all(sqlSuper, proposalId, (err, rows) => {
                if (err) {
                  reject(err);
                } else {
                  let coSupervisors = rows.map(s => {
                    return { id: s.id, name: s.name, surname: s.surname, email: s.email }
                  });
                  proposalInfo = { ...proposalInfo, coSupervisors};

                  // add external-co_supervisors
                  const sqlExtSup = "SELECT * FROM ExternalUsers eu, Supervisors s WHERE s.proposal_id=? AND s.external_supervisor=eu.id";
                  db.all(sqlExtSup, proposalId, (err, rows) => {
                    if(err) {
                      reject(err);
                    } else {
                      if(rows.length !== 0) {
                        let externalSupervisors = rows.map(e => {
                          return { name: e.name, surname: e.surname, email: e.email }
                        });
                        proposalInfo = {...proposalInfo, externalSupervisors};
                      }
                      resolve(proposalInfo);
                    }
                  });
                }
              });

            } 
          });

        }
      }
    })
  });
}

// Assuming you have access to the database and can execute SQL queries

export const getEmailsSupervisorsOneWeekExpiration = () => {
  return new Promise((resolve, reject) => {
  // Get today's date
  const today = new Date();
  
  // Calculate the date one week from today
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);

  // Convert dates to SQLite date format (assuming your database uses SQLite)
  const todayString = today.toISOString().split('T')[0];
  const oneWeekFromTodayString = oneWeekFromToday.toISOString().split('T')[0];

  // SQL query to retrieve emails of supervisors, co-supervisors, and external supervisors
    const sql = `
    SELECT DISTINCT T.email, P.title, P.expiration_date
    FROM Teachers T
    INNER JOIN Supervisors S ON (S.supervisor_id = T.id OR S.co_supervisor_id = T.id)
    INNER JOIN Proposals P ON S.proposal_id = P.id
    WHERE P.expiration_date BETWEEN '${todayString}' AND '${oneWeekFromTodayString}'
    AND P.status = "posted"

    UNION

    SELECT DISTINCT E.email, P.title, P.expiration_date
    FROM ExternalUsers E
    INNER JOIN Supervisors S ON E.id = S.external_supervisor
    INNER JOIN Proposals P ON S.proposal_id = P.id
    WHERE P.expiration_date BETWEEN '${todayString}' AND '${oneWeekFromTodayString}'
    AND P.status = "posted";
  `;


  db.all(sql, async (err, rows) => {
    if (err) {
      reject(err); // Reject the promise if there's an error
    } else {
      const objects = rows.map(row => ({ email: row.email, title: row.title, expiration_date: row.expiration_date }));
      resolve(objects); // Resolve with the mapped objects
    }
  });  
})}


export const getProposalTitleByApplicationId = (applicationid) => {
  return new Promise((resolve, reject) => {
      const sql = `
          SELECT Proposals.title
          FROM Proposals
          INNER JOIN Applications ON Proposals.id = Applications.proposal_id
          WHERE Applications.application_id = ?
      `;
    
      db.get(sql, [applicationid], (err, row) => {
          if (err) {
              reject(err);
          } else {
              resolve(row.title);
          }
      });
  });
};