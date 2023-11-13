import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import dayjs from 'dayjs';
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AppNavBar from "./components/AppBar.jsx";
import CustomSnackBar from "./components/CustomSnackbar.jsx";
import { UserContext } from './Contexts';
import TeacherPage from "./components/TeacherPage.jsx";
import AddProposalTeacher from "./components/AddProposalTeacher.jsx";
import InitialPage from "./pages/InitialPage.jsx";

function App() {
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [currentDataAndTime, setCurrentDataAndTime] =useState(dayjs()); 






  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
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
          </UserContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
