import { db } from '../config/db.js';

export const getAllDegrees = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Degrees';
        db.all(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            const degrees = rows.map((e) => {
                const obj = {
                    cod_degree: e.cod_degree,
                    title_degree: e.title_degree
                }
                return obj;
            });
            resolve(degrees);
        });
    });
}
