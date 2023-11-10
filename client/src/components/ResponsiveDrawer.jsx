import * as React from 'react';

import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import FilterComponent from './FilterComponent.jsx';
import SortComponent from './SortComponent.jsx';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';




export default function ResponsiveDrawer(props) {
  const {openSelectionsMobile, drawerWidth, setLevel, setExpirationDate, setKeywords, setSupervisorid} = props;
  const [openFilter, setOpenFilter] = React.useState(true);
  const [openSort, setOpenSort] = React.useState(true);

  const handleClickFilter = () => {
    setOpenFilter(!openFilter);
  };
  const handleClickSort = () => {
    setOpenSort(!openSort);
  };
  const handleResetFilters = () => {
    // Reset all filters here
    setLevel([]);
    setKeywords([]);
    setExpirationDate();
    setSupervisorid(null); // Assuming setSupervisorid is a function to set Supervisor ID
  };

  return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          display: !openSelectionsMobile ? "block" : "none", 
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: {sm:"100vw",md: drawerWidth}, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ overflow: 'auto', mt:"15vh", mx:"2vh" }}>
        
        <ListItemButton onClick={handleClickSort}>
          <Typography variant="h7" fontWeight={'bold'} >Sort by:</Typography> 
          <ListItemText  />
          {openSort ? <ExpandLess /> : <ExpandMore />}
         </ListItemButton>
         <Collapse in={openSort} timeout="auto" unmountOnExit>  
          <Divider />
          <List component="div" disablePadding>
            <SortComponent/>
          </List>
          </Collapse>

        <ListItemButton onClick={handleClickFilter}>
          <Typography variant="h7" fontWeight={'bold'} >Filter by:</Typography> 
          <ListItemText  />
          {openFilter ? <ExpandLess /> : <ExpandMore />}
         </ListItemButton>
         <Collapse in={openFilter} timeout="auto" unmountOnExit>  
          <Divider />
          <List component="div" disablePadding>
            <FilterComponent setLevel={setLevel} setExpirationDate={setExpirationDate} setKeywords={setKeywords} setSupervisorid={setSupervisorid}/>
          </List>
          </Collapse>

        
        <Link position="absolute" bottom="5vh" right="5vh" href="#" color="inherit" underline="none" onClick={handleResetFilters}>Reset all</Link>  
        </Box>
        
      </Drawer>
  );
}
