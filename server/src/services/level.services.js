import { db } from "../config/db.js";

export const getAllLevels = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT level FROM Proposals GROUP BY level";
    db.all(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      const keywords = rows.map((e) => {
        const obj = {
          id: e.level,
          name: e.level,
        };
        return obj;
      });
      resolve(keywords);
    });
  });
};
