"use strict"
const SERVER_URL = "http://localhost:3001";

const postProposal = async (title, type, description, level, expiration_date, notes, cod_degree, supervisor_id, cod_group) => {
    try {
        const response = await fetch(SERVER_URL + "/api/proposals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
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

const proposalsAPI = {
    postProposal,
    
};

export default proposalsAPI;
