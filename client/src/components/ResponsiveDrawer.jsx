import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import FilterComponent from './FilterComponent.jsx';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function ResponsiveDrawer(props) {
  const {
    openSelectionsMobile,
    setSelectedLevels,
    setSelectedExpirationDate,
    selectedKeywords,
    setSelectedKeywords,
    setSelectedSupervisorId,
    selectedExpirationDate,
    selectedLevels,
    selectedSupervisorId,
    currentDataAndTime,
    selectedStartExpirationDate,
    setSelectedStartExpirationDate,
    title,
    setTitle,
    drawerWidth
  } = props;

  const handleResetFilters = () => {
    // Reset all filters here
    setSelectedLevels([]);
    setSelectedKeywords([]);
    setSelectedExpirationDate(null);
    setSelectedStartExpirationDate(currentDataAndTime);
    setSelectedSupervisorId(null); // Assuming setSupervisorid is a function to set Supervisor ID
    handleMessage("Successfully Filter reset","success");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: {
          sm: openSelectionsMobile ? 'block' : 'none',
          md: 'block'
        },
         width: { xs:"100vw",sm: "100vw", md: `${drawerWidth}` },
        [`& .MuiDrawer-paper`]: {
          width: {xs:"100vw" ,sm: "100vw", md: `${drawerWidth}` },
          boxSizing: 'border-box',
        },
      }}
    >
      <Collapse in={ openSelectionsMobile ? openSelectionsMobile : true } sx={{ mt: '15vh',mx:'3vh',}} timeout="auto" unmountOnExit>
      <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%', 
      overflow:"hidden",
      position:"relative"
      
 }}>


            <FilterComponent
              setSelectedLevels={setSelectedLevels}
              selectedExpirationDate={selectedExpirationDate}
              selectedLevels={selectedLevels}
              setSelectedExpirationDate={setSelectedExpirationDate}
              setSelectedKeywords={setSelectedKeywords}
              setSelectedSupervisorId={setSelectedSupervisorId}
              selectedSupervisorId={selectedSupervisorId}
              selectedKeywords={selectedKeywords}
              currentDataAndTime={currentDataAndTime}
              selectedStartExpirationDate={selectedStartExpirationDate}
              setSelectedStartExpirationDate={setSelectedStartExpirationDate}
              title={title}
              setTitle={setTitle}
            />



        <Link
          position="absolute"
          bottom="2vh"
          right="2vw"
          href="#"
          color="red"
          underline="none"
          onClick={handleResetFilters}
        >
          Reset all
        </Link>
      </Box>
      </Collapse>
    </Drawer>
  );
}

ResponsiveDrawer.propTypes = {
  openSelectionsMobile: PropTypes.bool.isRequired,
  setSelectedLevels: PropTypes.func.isRequired,
  setSelectedExpirationDate: PropTypes.func.isRequired,
  selectedKeywords: PropTypes.array.isRequired,
  setSelectedKeywords: PropTypes.func.isRequired,
  setSelectedSupervisorId: PropTypes.func.isRequired,
  selectedExpirationDate: PropTypes.object,
  selectedLevels: PropTypes.array.isRequired,
  selectedSupervisorId: PropTypes.number,
  currentDataAndTime: PropTypes.object.isRequired,
  selectedStartExpirationDate: PropTypes.object.isRequired,
  setSelectedStartExpirationDate: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.string.isRequired
};