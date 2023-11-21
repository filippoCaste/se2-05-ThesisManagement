"use strict"
const SERVER_URL = "http://localhost:3001";

const getAllGroups = async () => {
    try {
        const response = await fetch(SERVER_URL + "/api/groups", {
            method: "GET",
            credentials: 'include'
        });
        if (response.ok) {
            const groups = await response.json();
            return groups;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }

};

const groupsAPI = {
    getAllGroups,
};

export default groupsAPI;
