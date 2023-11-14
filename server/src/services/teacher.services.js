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
                    teacher_id: e.id,
                    name: e.name,
                    surname: e.surname,
                    email: e.email,
                    cod_group: e.cod_group,
                    cod_department: e.cod_department
                }
                return obj;
            });
            resolve(teachers);
        });
    });
}

export const getTeacherById = (teacher_id) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT T.id as id, T.name as name, T.surname as surname, T.email as email, T.cod_group as cod_group, G.title_group as title_group, G.cod_department as cod_department " +
        "FROM Teachers T, Groups G WHERE T.id = ? AND T.cod_group = G.cod_group";
        db.get(sql, [teacher_id], (err,row) => {
            if(err) {
                reject(err);
            }
            if(row) {
                const teacher = {
                    id: row.id,
                    surname: row.surname,
                    name: row.name,
                    email: row.email,
                    cod_group: row.cod_group,
                    cod_department: row.cod_department,
                    group_name: row.title_group
                };
                resolve(teacher);
            } else {
                resolve(undefined)
            }
        });
    });
}