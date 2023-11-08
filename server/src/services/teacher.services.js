import { db } from '../config/db.js';

export const getAllTeachers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Teachers';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            const teachers = rows.map((e) => {
                const obj = {
                    cod_teacher: e.id,
                    cod_group: e.cod_group
                }
                return obj;
            });
            resolve(teachers);
        });
    });
}

export const getTeacherById = (teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT T.id as id, T.cod_group as cod_group, G.title_group as title_group, G.cod_department as cod_department FROM Teachers T, Groups G WHERE T.id = ? AND T.cod_group = G.cod_group";
        db.get(sql, [teacher_id], (err,row) => {
            if(err) {
                reject(err);
            }
            const teacher = {
                teacher_id: row.id,
                teacher_cod_group: row.cod_group,
                group_name: row.title_group,
                cod_department: row.cod_department
            };
            resolve(teacher);
        });
    });
}