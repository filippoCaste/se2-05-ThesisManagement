import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import dayjs from 'dayjs';
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AppNavBar from "./components/AppBar.jsx";
import CustomSnackBar from "./components/CustomSnackbar.jsx";
import { UserContext, MessageContext } from './Contexts';
import TeacherPage from "./pages/TeacherPage.jsx";
import AddProposalTeacher from "./components/AddProposalTeacher.jsx";
import BrowseApplicationsComponent from "./components/BrowseApplicationsComponent.jsx";
import InitialPage from "./pages/InitialPage.jsx";
import userAPI from "./services/users.api.js";
import { Student, Professor } from "./models/User.js";

function App() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [currentDataAndTime, setCurrentDataAndTime] =useState(dayjs()); 

  const handleMessage = (messageContent, severity) => {
      setMessage({text: messageContent, type: severity });
  };

  
  useEffect(() => {
    userAPI.getUserInfo().then((userInfo) => {
      if(userInfo?.email[0] === "s"){
          setUser(new Student(userInfo));
          handleMessage("Student successfully logged in", "success");
      }
      else if (userInfo?.email[0] === "d"){
          setUser(new Professor(userInfo));
          handleMessage("Teacher successfully logged in", "success");
      }
    }
    ).catch((err) => {    
      handleMessage(err,"warning"); // warning success
    });
  }, []);




  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserContext.Provider value={{ user, setUser }}>
            <MessageContext.Provider value={handleMessage}>
            <CustomSnackBar message={message}></CustomSnackBar>
            <AppNavBar
              openSelectionsMobile={openSelectionsMobile}
              setOpenSelectionsMobile={setOpenSelectionsMobile}
              currentDataAndTime={currentDataAndTime}
              setCurrentDataAndTime={setCurrentDataAndTime}

            />
            <Routes>
              <Route index path="/" element={<InitialPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/student"
                element={
                  <MainPage
                    openSelectionsMobile={openSelectionsMobile}
                    currentDataAndTime={currentDataAndTime}
                  />
                }
              />

              <Route path="/teacher" element={<TeacherPage />}  />
              <Route path="/teacher/addProposal" element={<AddProposalTeacher />}  />

            </Routes>
            </MessageContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
