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
      // console.log(result);
      const res2 = [];

      Object.keys(result).forEach((id) => {
        const keywords = [];

        result[id].forEach((items) => {
          if (items.keyword_id) {
            keywords.push({
              keyword_id: items.keyword_id,
              keyword_name: items.keyword_name,
              keyword_type: items.keyword_type,
            });
          }
        });

        res2.push({
          id: result[id][0].id,
          title: result[id][0].title,
          type: result[id][0].type,
          description: result[id][0].description,
          level: result[id][0].level,
          expiration_date: result[id][0].expiration,
          notes: result[id][0].notes,
          cod_degree: result[id][0].id,
          supervisor_id: result[id][0].id,
          cod_group: result[id][0].id,
          keywords,
        });
      });

      return resolve(res2);
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
