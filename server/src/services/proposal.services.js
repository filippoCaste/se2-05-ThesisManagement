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

export const postNewProposal = (title, type, description, level, expiration_date, notes, cod_degree, supervisor_id, cod_group) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Proposals(title, type, description, level, expiration_date, notes, cod_degree, supervisor_id, cod_group) VALUES (?,?,?,?,?,?,?,?,?)";
    const date = dayjs(expiration_date).format();
    console.log("the date is " + date);
    db.run(sql, [title, type, description, level, date, notes, cod_degree, supervisor_id, cod_group], (err) => {
      if(err) {
        reject(err)
      } else {
        resolve(true);
      }
    })
  })
}
