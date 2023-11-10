import { useEffect, useState } from "react";
import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";
import Box from '@mui/material/Box';
import MainDashboard from "../components/MainDashboard.jsx";
import proposalAPI from "../services/proposals.api.js";

function MainPage(props) {
  const {openSelectionsMobile,proposals, setProposals} = props;
  const [level,setLevel] = useState([]);
  const [expirationDate,setExpirationDate] = useState(null);
  const [keywords,setKeywords] = useState([]);
  const [supervisorid,setSupervisorid] = useState(null);
  const [filteredProposals,setFilteredProposals] = useState([]);

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
  const drawerWidth = "30vw"; 


  return (
   
   <Box sx={{ display:"inline-flex"}} mt={"15vh"} mx={"6vh"}>
    <ResponsiveDrawer openSelectionsMobile={openSelectionsMobile} drawerWidth={drawerWidth} setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid} />
    <MainDashboard proposals={filteredProposals} openSelectionsMobile={openSelectionsMobile} drawerWidth={drawerWidth}/>     
    </Box>
   );
}

export default MainPage;
