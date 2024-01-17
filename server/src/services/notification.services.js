"use strict";
import { db } from "../config/db.js";

export const getAllNotificationsForUser = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, user_id, title, message, is_read, created_at 
      FROM Notification 
      WHERE user_id = ? 
      ORDER BY created_at DESC`;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

export const getNotificationById = async (notificationId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, user_id, title, message, is_read, created_at
      FROM Notification
      WHERE id = ?`;
    db.get(sql, [notificationId], (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row);
    });
  });
};

export const deleteNotificationById = async (notificationId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Notification WHERE id = ?`;
    db.run(sql, [notificationId], (err) => {
      if (err) {
        return reject(err);
      }
      return resolve({ message: "Notification deleted successfully" });
    });
  });
};

export const deleteAllNotificationsForUser = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Notification WHERE user_id = ?`;
    db.run(sql, [userId], (err) => {
      if (err) {
        return reject(err);
      }
      return resolve({ message: "Notifications deleted successfully" });
    });
  });
};

export const setReadNotificationsForUser = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Notification SET is_read = 1 WHERE user_id = ?`;
    db.run(sql, [userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

export const saveNotificationToDB = async (userId, title, message) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Notification (user_id, title, message, created_at) VALUES (?, ?, ?, ?)`;
    const createdAt = new Date().toISOString();
    db.run(sql, [userId, title, message, createdAt], (err) => {
      if (err) {
        return reject(err);
      }
      return resolve({ message: "Notification saved successfully" });
    });
  });
};