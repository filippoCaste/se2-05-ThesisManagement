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
