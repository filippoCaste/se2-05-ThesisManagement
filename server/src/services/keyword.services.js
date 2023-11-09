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
                    name: e.name,
                    type: e.type
                }
                return obj;
            });
            resolve(keywords);
        });
    });
}
