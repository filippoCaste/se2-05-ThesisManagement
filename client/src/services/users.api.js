import { User } from "../models/User";

const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

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

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/session/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const registerUser = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/session/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getAllUsers = async () => {
  const response = await fetch(SERVER_URL + "/api/users/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    const users = await response.json();
    const userList = [];
    for (const user of users) {
      userList.push(User.fromJson(user));
    }
    return userList;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const userAPI = {
  logIn,
  logOut,
  getUserInfo,
  registerUser,
  getAllUsers,
};
export default userAPI;
