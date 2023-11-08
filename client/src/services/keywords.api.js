"use strict"
const SERVER_URL = "http://localhost:3001";

const postKeywords = async (name, type) => {
    try {
        const data = {name,type};

        const response = await fetch(SERVER_URL + "/api/keywords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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



const keywordsAPI = {
    postKeywords

};

export default keywordsAPI;
