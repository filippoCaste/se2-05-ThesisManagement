"use strict"
const SERVER_URL = "http://localhost:3001";

const postProposal = async (title, type, description, level, expiration_date, notes, required_knowledge,cod_degree,cod_group, supervisors_obj, keywords) => {
    
        try {
 
        const data = 
        {
            title, type, description, level, expiration_date, notes, required_knowledge,
            cod_degree,cod_group, supervisors_obj, keywords
        };


        const response = await fetch(SERVER_URL + "/api/proposals", {
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


const postProposalKeywords = async (proposal_id, keyword_id) => {
    try {
        const data= {proposal_id, keyword_id};

        const response = await fetch(SERVER_URL + "/api/proposal_keyword", {
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

const getAllProposals = async () => {
    try {
        const response = await fetch(SERVER_URL + "/api/proposals", {
            method: "GET",
        });
        if (response.ok) {
            const proposals = await response.json();
            return proposals;
        } else {
            const message = await response.text();
            throw new Error("Application error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }

};


const getProposalsByTeacherId = async (teacherId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/proposals/teachers/${teacherId}`, {
            method: "GET",
        });
        if (response.ok) {
            const proposals = await response.json();
            return proposals;
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
    postProposalKeywords,
    getAllProposals,
    getProposalsByTeacherId

};

export default proposalsAPI;
