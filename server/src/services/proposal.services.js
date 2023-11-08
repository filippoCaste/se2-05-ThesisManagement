import { db } from '../config/db.js';

export const getProposalsFromDB = (level_ids, keyword_ids, supervisor_id, start_date, end_date) => {
  return new Promise((resolve, reject) => {
    const sql = `
      WITH ProposalKeywordsDetail AS (SELECT proposal_id, keyword_id, name AS keyword_name, type AS keyword_type
        FROM ProposalKeywords JOIN Keywords ON Keywords.id=ProposalKeywords.keyword_id)
      
      SELECT * FROM Proposals LEFT JOIN ProposalKeywordsDetail ON Proposals.id = ProposalKeywordsDetail.proposal_id 
        WHERE (level IN (${level_ids.map(() => '?').join(',')}) ${!level_ids || level_ids.length === 0 ? 'OR 1=1' : ''}) 
        AND (keyword_id IN (${keyword_ids.map(() => '?').join(',')}) ${!keyword_ids || keyword_ids.length === 0 ? 'OR 1=1' : ''})
        AND (supervisor_id=? ${!supervisor_id ? 'OR 1=1' : ''});    
    `;
    db.all(sql, [...level_ids, ...keyword_ids, supervisor_id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const result = rows.reduce((rv, x) => {
        // eslint-disable-next-line no-param-reassign
        (rv[x.id] = rv[x.id] || []).push(x);
        return rv;
      }, {});
      // console.log(result)
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
