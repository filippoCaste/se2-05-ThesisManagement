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
import proposalAPI from "./services/proposals.api.js";

function App() {
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [proposals,setProposals] = useState([]);
  const [level,setLevel] = useState([]);
  const [expirationDate,setExpirationDate] = useState(null);
  const [keywords,setKeywords] = useState([]);
  const [supervisorid,setSupervisorid] = useState(null);
  const [filteredProposals,setFilteredProposals] = useState([]);
  const [currentDataAndTime, setCurrentDataAndTime] =useState(dayjs());  

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

  return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
            <AppNavBar
              openSelectionsMobile={openSelectionsMobile}
              setOpenSelectionsMobile={setOpenSelectionsMobile}
              currentDataAndTime={currentDataAndTime}
              setCurrentDataAndTime={setCurrentDataAndTime}
              proposals={filteredProposals}
      />
            <CustomSnackBar message={message}></CustomSnackBar>
            <Routes>
              <Route index path="/" element={<InitialPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/student" element={<MainPage openSelectionsMobile={openSelectionsMobile} proposals={filteredProposals} setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid}/>} />
              <Route path="/teacher" element={<TeacherPage />}  />
              <Route path="/teacher/addProposal" element={<AddProposalTeacher />}  />
              

            </Routes>
          </UserContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
