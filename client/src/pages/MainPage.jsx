
import CardCustomized from "../components/CardCustomized.jsx";
import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MainDashboard from "../components/MainDashboard.jsx";

function MainPage(props) {
  const {openSelectionsMobile} = props;
  //
   
  return (
   
   <Box sx={{ display:"inline-flex"}} mt={"15vh"} mx={"6vh"}>
    <ResponsiveDrawer openSelectionsMobile={openSelectionsMobile}/>
    <MainDashboard/>     
    </Box>
   );
}

export default MainPage;