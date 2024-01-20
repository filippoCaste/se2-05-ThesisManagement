"use strict";
const SERVER_URL = "http://localhost:3001";

const createApplication = async (proposal_id, student_id, submission_date) => {
  try {
    const data = { proposal_id, student_id, submission_date };

    const response = await fetch(SERVER_URL + "/api/applications", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const application = await response.json();
      return application.id;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const getApplicationStudentsByProposalId = async (proposalId) => {
  try {
    const response = await fetch(SERVER_URL + `/api/applications/proposal/${proposalId}`, {
      method: "GET",
      credentials: 'include',
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

const changeStatusOfApplication = async (applicationId, status) => {
  try {
    const data = { status };

    const response = await fetch(SERVER_URL + `/api/applications/${applicationId}`, {
      method: "PUT",
      credentials: 'include',
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

const getStudentApplications = async () => {
  try {
    const response = await fetch(SERVER_URL + `/api/applications`, {
      method: "GET",
      credentials: 'include',
    });
    if (response.ok) {
      const applications = await response.json();
      console.log(applications)
      return applications;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const applicationsAPI = {
  createApplication,
  getApplicationStudentsByProposalId,
  changeStatusOfApplication,
  getStudentApplications,
};

export default applicationsAPI;
