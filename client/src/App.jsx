import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AppNavBar from "./components/AppBar.jsx";
import CustomSnackBar from "./components/CustomSnackbar.jsx";
import { UserContext } from './Contexts';
import { User } from "./models/User";
import dayjs from 'dayjs';
import TeacherPage from "./components/TeacherPage.jsx";
import AddProposalTeacher from "./components/AddProposalTeacher.jsx";
import InitialPage from "./pages/InitialPage.jsx";

function App() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(new User());
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [currentDataAndTime, setCurrentDataAndTime] =useState(dayjs());

  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserContext.Provider value={{ user, setUser }}>
            <AppNavBar
              user={user}
              openSelectionsMobile={openSelectionsMobile}
              setOpenSelectionsMobile={setOpenSelectionsMobile}
              currentDataAndTime={currentDataAndTime}
              setCurrentDataAndTime={setCurrentDataAndTime}
            />
            <CustomSnackBar message={message}></CustomSnackBar>
            <Routes>
              <Route index path="/" element={<InitialPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/student" element={<MainPage openSelectionsMobile={openSelectionsMobile} currentDataAndTime={currentDataAndTime} />} />
              <Route path="/teacher" element={<TeacherPage />}  />
              <Route path="/teacher/addProposal" element={<AddProposalTeacher />}  />
              

            </Routes>
          </UserContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
