"use strict"
const SERVER_URL = "http://localhost:3001";

const getApplicationStudentsByProposalId = async (proposalId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/applications/proposal/${proposalId}`, {
            method: "GET",
        });
        if (response.ok) {
            const application = await response.json();
            return application;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }

};

const applicationsAPI = {
    getApplicationStudentsByProposalId,

};

export default applicationsAPI;