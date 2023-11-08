import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AppNavBar from "./components/AppBar.jsx";
import CustomSnackBar from "./components/CustomSnackbar.jsx";
import User from "./models/User.js";
import userAPI from "./services/users.api.js";
import dayjs from 'dayjs';
import TeacherPage from "./components/TeacherPage.jsx";
import AddProposalTeacher from "./components/AddProposalTeacher.jsx";

function App() {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(new User());
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [currentDataAndTime, setCurrentDataAndTime] =useState(dayjs());
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await userAPI.getUserInfo(); // we have the user info here
        if (!user) return;
        setLoggedIn(true);
        setUser(user);
        setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
      } catch (error) {
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await userAPI.logIn(credentials);
      console.log(user);
      setUser(user);
      setLoggedIn(true);
      setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
      return true;
    } catch (err) {
      setMessage({ text: err, type: "error" });
      return false;
    }
  };

  const registerUser = async (credentials) => {
    try {
      const user = await userAPI.registerUser(credentials);
      setLoggedIn(true);
      setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
    } catch (err) {
      console.log(err);
      setMessage({ text: "erro", type: "error" });
    }
  };

  const handleLogout = async () => {
    await userAPI.logOut();
    setLoggedIn(false);
    setUser(new User());
    setMessage({ text: "Logged out", type: "success" });
  };

  return (
      <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AppNavBar
        user={user}
        logOut={handleLogout}
        openSelectionsMobile={openSelectionsMobile}
        setOpenSelectionsMobile={setOpenSelectionsMobile}
        currentDataAndTime={currentDataAndTime}
        setCurrentDataAndTime={setCurrentDataAndTime}
      />
      <CustomSnackBar message={message}></CustomSnackBar>
      <Routes>
        <Route index path="/" element={<MainPage openSelectionsMobile={openSelectionsMobile} currentDataAndTime={currentDataAndTime} />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage login={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage signup={registerUser} />} />

        <Route path="/teacher" element={<TeacherPage />}  />
        <Route path="/teacher/addProposal" element={<AddProposalTeacher />}  />
        

      </Routes>

    </BrowserRouter>
          </ThemeProvider>
  );
}

export default App;
