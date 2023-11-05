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
