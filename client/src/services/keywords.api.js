"use strict";
const SERVER_URL = "http://localhost:3001";

const getAllKeywords = async () => {
  try {
    const response = await fetch(SERVER_URL + "/api/keywords", {
      method: "GET",
    });
    if (response.ok) {
      const keywords = await response.json();
      return keywords;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const postKeywords = async (name, type) => {
  try {
    const data = { name, type };

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
  getAllKeywords,
  postKeywords,
};

export default keywordsAPI;
