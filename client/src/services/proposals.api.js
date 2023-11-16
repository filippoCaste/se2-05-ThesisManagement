"use strict";
import Proposal from "../models/Proposal";
const SERVER_URL = "http://localhost:3001";

const postProposal = async (
  title,
  type,
  description,
  level,
  expiration_date,
  notes,
  required_knowledge,
  cod_degree,
  cod_group,
  supervisors_obj,
  keywords
) => {
  try {
    const data = {
      title,
      type,
      description,
      level,
      expiration_date,
      notes,
      required_knowledge,
      cod_degree,
      cod_group,
      supervisors_obj,
      keywords,
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
    const data = { proposal_id, keyword_id };

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

const getProposals = async (
  cod_degree,
  level_ids,
  keyword_ids,
  supervisor_id,
  start_expiration_date,
  end_expiration_date
) => {
  try {
    // Construct the URL with query parameters
    let url = `${SERVER_URL}/api/proposals`;
    // Query parameters based on your server-side routes
    const queryParams = [];
    if (cod_degree) {
      queryParams.push(`cod_degree=${cod_degree}`);
    }
    if (level_ids.length != 0) {
      queryParams.push(
        `level_ids=[${level_ids
          .map((value) => '"' + value.id + '"')
          .join(",")}]`
      );
    }
    if (keyword_ids.length != 0) {
      queryParams.push(
        `keyword_ids=[${keyword_ids
          .map((value) => '"' + value.id + '"')
          .join(",")}]`
      );
    }
    if (supervisor_id) {
      queryParams.push(`supervisor_id=${supervisor_id}`);
    }
    if (start_expiration_date) {
      queryParams.push(`start_date=${start_expiration_date}`);
    }
    if (end_expiration_date) {
      queryParams.push(`end_date=${end_expiration_date}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    const response = await fetch(url);
    if (response.ok) {
      const proposals = await response.json();
      const proposalList = [];

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

const proposalAPI = {
  getProposals,
  postProposal,
  postProposalKeywords,
  getProposalsByTeacherId
};

export default proposalAPI;
