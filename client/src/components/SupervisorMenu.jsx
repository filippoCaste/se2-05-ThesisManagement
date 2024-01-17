import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import PropTypes from 'prop-types';

export default function SimpleListMenu(props) {
  const {supervisorId, setSupervisorid, supervisors} = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, supervisor) => {
    setSupervisorid(supervisor.teacher_id)
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
    primary={
      supervisorId && supervisors.find((supervisor) => supervisor.teacher_id === supervisorId) ? 
        supervisors.find((supervisor) => supervisor.teacher_id === supervisorId).name + " " + supervisors.find((supervisor) => supervisor.teacher_id === supervisorId).surname
        : "Select a supervisor"
    }
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
            key={supervisor.teacher_id}
            onClick={(event) => handleMenuItemClick(event, supervisor)}
          >
            {supervisor.name + " " + supervisor.surname}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

SimpleListMenu.propTypes = {
  supervisorId: PropTypes.string.isRequired,
  setSupervisorid: PropTypes.func.isRequired,
  supervisors: PropTypes.array.isRequired,
};