"use strict";
const SERVER_URL = "http://localhost:3001";

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/session/current", {
    credentials: "include",
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    return null;
  }
};

const userAPI = {
  getUserInfo
};
export default userAPI;
