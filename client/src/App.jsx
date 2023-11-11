import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.jsx";
import dayjs from 'dayjs';
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
import proposalAPI from "./services/proposals.api.js";

function App() {
  const [message, setMessage] = useState("");
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
          <UserContext.Provider value={{ user, setUser }}>
            <AppNavBar
              user={user}
              openSelectionsMobile={openSelectionsMobile}
              setOpenSelectionsMobile={setOpenSelectionsMobile}
              currentDataAndTime={currentDataAndTime}
              setCurrentDataAndTime={setCurrentDataAndTime}
              proposals={filteredProposals}
      />
            <CustomSnackBar message={message}></CustomSnackBar>
            <Routes>
              <Route index path="/" element={<InitialPage proposals={filteredProposals} setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid}/>} />
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
