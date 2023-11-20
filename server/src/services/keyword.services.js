import { db } from '../config/db.js';

export const getAllKeywords = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Keywords';
        db.all(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            const keywords = rows.map((e) => {
                const obj = {
                    id: e.id,
                    name: e.name,
                    type: e.type
                }
                return obj;
            });
            resolve(keywords);
        });
    });
}

export const postKeyword = (keywordName) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Keywords(name, type) VALUES (?, "KEYWORD")';
        db.run(sql, [keywordName], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
}

export const getKeywordByName = (keywordName) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM Keywords WHERE name = ?';
        db.get(sql, [keywordName], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}