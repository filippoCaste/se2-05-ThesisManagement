"use strict";
const SERVER_URL = "http://localhost:3001";

/**
 * 
 * @param {Object} studentRequest 
 * - `title`
 * - `type`
 * - `description`
 * - `notes`
 * - `teacherEmail`
 * - `coSupervisorEmails[]`
 * - `status`
 * @returns 
 */
const postStudentRequest = async (studentRequest) => {
    try {
        const response = await fetch(SERVER_URL + "/api/proposals/request", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentRequest),
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }
};

const studentRequestAPI = {
    postStudentRequest,
}

export default studentRequestAPI;