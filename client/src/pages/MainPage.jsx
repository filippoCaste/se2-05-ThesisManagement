import { useEffect, useState } from "react";
import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";
import Box from '@mui/material/Box';
import MainDashboard from "../components/MainDashboard.jsx";
import proposalAPI from "../services/proposals.api.js";

function MainPage(props) {
  const {openSelectionsMobile,proposals, setLevel, setExpirationDate, setKeywords, setSupervisorid} = props;
  const drawerWidth = "30vw"; 

  return (
   
   <Box sx={{ display:"inline-flex"}} mt={"15vh"} mx={"6vh"}>
    <ResponsiveDrawer openSelectionsMobile={openSelectionsMobile} drawerWidth={drawerWidth} setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid} />
    <MainDashboard proposals={proposals} openSelectionsMobile={openSelectionsMobile} drawerWidth={drawerWidth}/>     
    </Box>
   );
}

export default MainPage;
