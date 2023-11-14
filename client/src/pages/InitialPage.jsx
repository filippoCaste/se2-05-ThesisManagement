import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, Professor } from '../models/User';
import teachersAPI from '../services/teachers.api';
import studentsAPI from '../services/students.api';
import { UserContext } from '../Contexts';

function InitialPage() {
    const {
        user,
        isAuthenticated
      } = useAuth0();
      const navigate = useNavigate();
      const { setUserData } = useContext(UserContext); 

      useEffect(() => {
        const fetchData = async () => {
          if (isAuthenticated) {
            if (user.email.startsWith("s")) {
              const studentData = await studentsAPI.getStudentById(user.email.substring(1, user.email.indexOf("@")));
              setUserData(new Student(studentData));
              navigate("/student");
            } else {
              const teacherData = await teachersAPI.getTeacherById(user.email.substring(1, user.email.indexOf("@")));
              setUserData(new Professor(teacherData));
              navigate("/teacher");
            }
          }
        };
      
        fetchData();
      }, [isAuthenticated]);

    return (
        <></> 
    );
};

export default InitialPage;