"use strict";
const SERVER_URL = "http://localhost:3001";

const getCareerByStudentId = async (studentId) => {
    try {
        const response = await fetch(SERVER_URL + `/api/careers/student/${studentId}`, {
        method: "GET",
        credentials: 'include',
        });
        if (response.ok) {
            const careers = await response.json();
            return careers;
        } else {
            const message = await response.text();
            throw new Error("Career error: " + message);
        }
    } catch (error) {
        throw new Error("Network Error: " + error.message);
    }
};

const uploadFile = async (file, proposalId, studentId) => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', file);

      const response = await fetch(SERVER_URL + `/api/careers/upload/student/${studentId}/proposal/${proposalId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    }
  };
  

const careerAPI = {
    getCareerByStudentId, uploadFile
};

export default careerAPI;