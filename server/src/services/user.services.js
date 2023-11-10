import { User } from "../models/User.js";
import crypto from "crypto";
import { db } from "../config/db.js";

export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Users (username, email, password, salt, role) VALUES (?, ?, ?, ?, ?)";
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(user.password, salt, 32, function (err, hashedPassword) {
      if (err) {
        reject(err);
      }
      if (!hashedPassword) reject("Error hashing password");
      db.run(
        sql,
        [
          user.username,
          user.email,
          hashedPassword.toString("hex"),
          salt,
          "user",
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            const returnedUser = {
              email: user.email,
              name: user.name,
              password: hashedPassword.toString("hex"),
              salt: salt,
              role: "user",
            };
            resolve(returnedUser);
          }
        }
      );
    });
  });
};

export const verifyUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role,
        };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

export const getAllUsersFromDB = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Users";
    db.all(query, [], async (err, rows) => {
      if (err) reject(err);
      else {
        const usersList = [];
        for (const user of rows) {
          usersList.push(User.fromJson(user));
        }
        resolve(usersList);
      }
    });
  });
};
