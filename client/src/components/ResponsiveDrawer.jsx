import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import FilterComponent from './FilterComponent.jsx';
import Collapse from '@mui/material/Collapse';

import Box from '@mui/material/Box';

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
        width: { sm: '100vw', md: "30vw" },
        display: {
          sm: openSelectionsMobile ? 'block' : 'none',
          md: 'block',
        },
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: { sm: '100vw', md: "30vw" },
          boxSizing: 'border-box',
        },
      }}
    >
      <Collapse in={{ sm: openSelectionsMobile, md: true }} timeout="auto" unmountOnExit>
      <Box sx={{ overflow: 'hidden', mt: '15vh', mx: '2vw', position:"relative"}}>


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
          bottom="1vh"
          right="1vw"
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
