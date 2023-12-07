"use strict";
const SERVER_URL = "http://localhost:3001";

const getCareerByStudentId = async (studentId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/careers/student/${studentId}`, {
        method: "GET",
        credentials: 'include',
        });
        if (response.ok) {
            const careers = await response.json();
            return careers;
        } else {
            const message = await response.text();
            throw new Error("Career error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }
};

const getPDFFile = async (studentId, applicationId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/careers/student/${studentId}/application/${applicationId}`, {
        method: "GET",
        credentials: 'include',
        });
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }
};

const careerAPI = {
    getCareerByStudentId, getPDFFile
};

export default careerAPI;