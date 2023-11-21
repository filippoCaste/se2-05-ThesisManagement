"use strict";
const SERVER_URL = "http://localhost:3001";

const getLevels = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/levels`, {
      credentials: 'include'
    });
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
const levelAPI = {
  getLevels,
};

export default levelAPI;
