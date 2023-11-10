import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import dayjs from 'dayjs';
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
import proposalAPI from "./services/proposals.api.js";

function App() {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(new User());
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [proposals,setProposals] = useState([]);
  const [level,setLevel] = useState([]);
  const [expirationDate,setExpirationDate] = useState(null);
  const [keywords,setKeywords] = useState([]);
  const [supervisorid,setSupervisorid] = useState(null);
  const [filteredProposals,setFilteredProposals] = useState([]);

    useEffect(() => {
    const resultProposals = async () => {
      try{
        const codDegree = 1; //DEBUGGING
        const startDate = dayjs().format("YYYY-MM-DD");
        const resultsResponse = await proposalAPI.getProposals(codDegree);

        if(resultsResponse)
        setProposals(resultsResponse);
   
      } catch (error) {
          setProposals([]);
      }
    };
    resultProposals().catch(console.error);
  },[])


  useEffect(() => {
    const filterProposals = () => {
      const filtered = proposals.filter((proposal) => {
        if (level.length !== 0 && !level.some(item => item.label === proposal.level)) {
          return false;
        }

        if (expirationDate !== null && proposal.expirationDate < expirationDate) {
          return false;
        }

        if (supervisorid !== null && !proposal.supervisorsInfo.some(supervisor => supervisor === id) ) {
          return false;
        }

       // if (keywords !== null &&  proposal.keywords.contain(keywords)) {
       //   return false;
       // }

        return true;
      });

      setFilteredProposals(filtered);
    };

    filterProposals();
  }, [proposals, level.length, expirationDate, keywords.length, supervisorid]);



  const handleLogin = async (credentials) => {
    try {
      const user = await userAPI.logIn(credentials);

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
        proposals={filteredProposals}
      />
      <CustomSnackBar message={message}></CustomSnackBar>
      <Routes>
        <Route index path="/" element={<MainPage openSelectionsMobile={openSelectionsMobile} proposals={filteredProposals} setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid}/>} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage login={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage signup={registerUser} />} />
      </Routes>

    </BrowserRouter>
          </ThemeProvider>
  );
}

export default App;
