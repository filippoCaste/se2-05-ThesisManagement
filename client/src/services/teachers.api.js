"use strict";
const SERVER_URL = "http://localhost:3001";

const getAllTeachers = async () => {
  try {
    const response = await fetch(SERVER_URL + "/api/teachers", {
      method: "GET",
      credentials: 'include',
    });
    if (response.ok) {
      const teachers = await response.json();
      return teachers;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const getTeacherById = async (teacherId) => {
  try {
    const tst = parseInt(teacherId);

    if (isNaN(tst)) {
      throw new Error("Invalid request");
    }

    const response = await fetch(SERVER_URL + `/api/teachers/${teacherId}`, {
      method: "GET",
      credentials: 'include',
    });

    if (response.ok) {
      const teacher = await response.json();
      return teacher;
    } else {
      const message = await response.text();
      throw new Error("Application error: " + message);
    }
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const teachersAPI = {
  getAllTeachers,
  getTeacherById,
};

export default teachersAPI;
