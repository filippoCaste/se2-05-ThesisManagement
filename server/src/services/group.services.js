import { db } from '../config/db.js';

export const getAllGroups = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Groups';
        db.all(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            const degrees = rows.map((e) => {
                const obj = {
                    cod_group: e.cod_group,
                    cod_department: e.cod_department,
                    title_group: e.title_group
                }
                return obj;
            });
            resolve(degrees);
        });
    });
}
