"use strict";
import Proposal from "../models/Proposal";
import ProposalRequest from "../models/ProposalRequest";

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
      credentials: "include",
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
      credentials: "include",
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

    const response = await fetch(url, {
      credentials: "include",
    });
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
    const response = await fetch(
      SERVER_URL + `/api/proposals/teachers/${teacherId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
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

const getProposalsByCoSupervisorId = async (teacherId) => {
  try {
    const response = await fetch(SERVER_URL + `/api/proposals/cosupervisors/${teacherId}`, {
      method: "GET",
      credentials: 'include',
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

//  fetch(  SERVER_URL + `/api/proposals/${id}`, {

const updateProposal = async (
  id,
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

    const response = await fetch(SERVER_URL + `/api/proposals/${id}`, {
      method: "PUT",
      credentials: "include",
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

const getProposalByProposalId = async (proposalId) => {
  try {
    const response = await fetch(SERVER_URL + `/api/proposals/${proposalId}`, {
      method: "GET",
      credentials: "include",
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

const deleteProposal = async (proposalId) => {
  try {
    const response = await fetch(SERVER_URL + `/api/proposals/${proposalId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      const deleted = await response.json();
      return deleted;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};
const archivedProposal = async (proposalId) => {
  try {
    const response = await fetch(
      SERVER_URL + `/api/proposals/${proposalId}/archived`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    if (response.ok) {
      const deleted = await response.json();
      return deleted;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const getProposalRequests = async () => {
  try {
    let url = `${SERVER_URL}/api/proposals/request`;
    const response = await fetch(url, {
      credentials: "include",
    });

    if (response.ok) {
      const proposalRequests = await response.json();
      const proposalRequestsList = [];

      for (const proposalRequest of proposalRequests) {
        proposalRequestsList.push(
          ProposalRequest.fromProposalRequestsResult(proposalRequest)
        );
      }

      return proposalRequestsList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

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
      credentials: "include",
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

const changeStatusProposalRequest = async (proposalRequestId, status) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/proposals/request/${proposalRequestId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Sending type as an object
      }
    );

    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error("Request error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};
export const updateThesisRequestStatusApi = async (
  proposalId,
  status,
  note
) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/proposals/${proposalId}/approval`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, note }),
      }
    );

    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error("Request error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const proposalAPI = {
  getProposals,
  postProposal,
  postProposalKeywords,
  getProposalsByTeacherId,
  getProposalByProposalId,
  getProposalsByCoSupervisorId,
  updateProposal,
  deleteProposal,
  archivedProposal,
  getProposalRequests,
  postStudentRequest,
  changeStatusProposalRequest,
  updateThesisRequestStatusApi,
};

export default proposalAPI;
