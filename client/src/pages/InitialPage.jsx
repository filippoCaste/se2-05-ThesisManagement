import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, Professor } from '../models/User';
import teachersAPI from '../services/teachers.api';
import { UserContext } from '../Contexts';

function InitialPage() {
    const {
        user,
        isAuthenticated
      } = useAuth0();
      const navigate = useNavigate();
      const { setUser } = useContext(UserContext); 

      useEffect(() => {
        const fetchData = async () => {
          if (isAuthenticated) {
            if (user.email.startsWith("s")) {
              setUser(new Student("318082", "Giunta", "Giovanni", user.email, "male", "italian", "4", "2022"));
              navigate("/student");
            } else {
              const teacherData = await teachersAPI.getTeacherById(user.email.substring(1, user.email.indexOf("@")));
              setUser(new Professor(teacherData));
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