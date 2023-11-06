import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const supervisors = [
  'Cabodi',
  'Quer',
  'Malnati',
];

export default function SimpleListMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = React.useState();
  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, supervisor) => {
    setSelectedSupervisor(supervisor);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Supervisors"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItem
          button
          id="supervisor-button"
          aria-haspopup="listbox"
          aria-controls="supervisor-menu"
          aria-label="Select supervisor"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary={selectedSupervisor ? selectedSupervisor : "Select a supervisor"}
          />
        </ListItem>
      </List>
      <Menu
        id="supervisor-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'supervisor-button',
          role: 'listbox',
        }}
      >
        {supervisors.map((supervisor) => (
          <MenuItem
            key={supervisor}
            onClick={(event) => handleMenuItemClick(event, supervisor)}
          >
            {supervisor}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
