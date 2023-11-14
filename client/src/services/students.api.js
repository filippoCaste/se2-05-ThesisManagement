"use strict"
const SERVER_URL = "http://localhost:3001";

const getStudentById = async (studentId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/students/${studentId}`, {
            method: "GET",
        });
        if (response.ok) {
            const student = await response.json();
            return student;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Error: " + error.message);
    }
}

const studentsAPI = {
    getStudentById,
};

export default studentsAPI;