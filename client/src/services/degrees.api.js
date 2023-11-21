"use strict"
const SERVER_URL = "http://localhost:3001";

const getAllDegrees = async () => {
    try {
        const response = await fetch(SERVER_URL + "/api/degrees", {
            method: "GET",
            credentials: 'include',
        });
        if (response.ok) {
            const degrees = await response.json();
            return degrees;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }

};

const proposalsAPI = {
    getAllDegrees,

};

export default proposalsAPI;
