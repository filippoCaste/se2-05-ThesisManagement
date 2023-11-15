import { User } from "../models/User.js";
import { db } from "../config/db.js";

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.log(err);
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
