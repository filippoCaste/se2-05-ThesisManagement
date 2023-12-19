import { User } from "../models/User.js";
import { db } from "../config/db.js";

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row) {
        const user = new User(row.id, row.email, row.name, row.surname, row.role);
        resolve(user);
      } else {
        resolve(undefined);
      }
    });
  });
}
export const getEmailById = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT email FROM Users WHERE id = ?';
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row?.email) {
          resolve(row.email);
      } else {
          resolve(null); // User not found or email is empty
      }
    });
  });
};