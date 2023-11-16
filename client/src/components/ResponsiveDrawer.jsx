import * as React from 'react';
import { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import FilterComponent from './FilterComponent.jsx';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

export default function ResponsiveDrawer(props) {
  const {
    openSelectionsMobile,
    drawerWidth,
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
  const [openFilter, setOpenFilter] = React.useState(true);

  const handleClickFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleResetFilters = () => {
    // Reset all filters here
    setSelectedLevels([]);
    setSelectedKeywords([]);
    setSelectedExpirationDate(null);
    setSelectedStartExpirationDate(currentDataAndTime);
    setSelectedSupervisorId(null); // Assuming setSupervisorid is a function to set Supervisor ID
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        display: {
          sm: openSelectionsMobile ? 'block' : 'none',
          md: 'block',
        },

        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: { sm: '100vw', md: drawerWidth },
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: '15vh', mx: '2vh' }}>
        <ListItemButton onClick={handleClickFilter}>
          <Typography variant="h7" fontWeight={'bold'}>
            Filter by:
          </Typography>
          <ListItemText />
          {openFilter ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFilter} timeout="auto" unmountOnExit>
          <Divider />
          <List component="div" disablePadding>
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
          </List>
        </Collapse>

        <Link
          position="absolute"
          bottom="5vh"
          right="5vh"
          href="#"
          color="inherit"
          underline="none"
          onClick={handleResetFilters}
        >
          Reset all
        </Link>
      </Box>
    </Drawer>
  );
}
