import sqlite from "sqlite3";

// open the database
const db = new sqlite.Database("database.db", (err) => {
  if (err) throw err;
});

export { db };