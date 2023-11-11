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

const proposalsAPI = {
    postProposal,
    postProposalKeywords,
    
};

export default proposalsAPI;
import Proposal from "../models/Proposal";

const SERVER_URL = "http://localhost:3001";

const getProposals = async (cod_degree, start_date, end_date) => {
  try {
    // Construct the URL with query parameters
    let url = `${SERVER_URL}/api/proposals`;
    // Query parameters based on your server-side routes
    const queryParams = [];
    if (cod_degree) {
      queryParams.push(`cod_degree=${cod_degree}`);
    }
    if (start_date) {
      queryParams.push(`start_date=${start_date}`);
    }
    if (end_date) {
      queryParams.push(`end_date=${end_date}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    const response = await fetch(url);
    if (response.ok) {
      const proposals = await response.json();
      const proposalList = [];
      console.log(proposals);
      for (const proposal of proposals) {
        proposalList.push(Proposal.fromProposalsResult(proposal));
      }
      return proposalList;
    } else {
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

const getKeywords = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/keywords`);
    if (response.ok) {
      const keywords = await response.json();
      return keywords;
    } else {
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

const getLevels = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/levels`);
    if (response.ok) {
      const levels = await response.json();
      return levels;
    } else {
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

const proposalAPI = {
  getProposals,
  getKeywords,
  getLevels,
};

export default proposalAPI;
