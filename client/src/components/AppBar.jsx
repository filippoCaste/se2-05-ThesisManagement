import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ClockCustomized from './ClockCustomized';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import headerBackground from "../../public/img/imageedit_3_5228036516.jpg";
import Logout from '@mui/icons-material/Logout';
import Image from "mui-image";
import { AppBar, Toolbar, IconButton, Typography, Badge, MenuItem, Menu , TextField, ListItemIcon, Box} from '@mui/material';
import { UserContext } from '../Contexts';
import { useAuth0 } from "@auth0/auth0-react";


export default function PrimarySearchAppBar(props) {
  const {openSelectionsMobile, setOpenSelectionsMobile,currentDataAndTime, setCurrentDataAndTime, proposals} = props;
  const [openClock, setOpenClock] = React.useState(false);
  const [anchorElA, setAnchorElA] = React.useState(null);
  const [mobileMoreAnchorElA, setMobileMoreanchorElA] = React.useState(null);
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const { userData } = React.useContext(UserContext);
  
  const handleClockOpen = () => {
    setOpenClock(true);
  };

  const handleClockClose = () => {
    setOpenClock(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorElA(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreanchorElA(null);
  };
  const handleMenuClose = () => {
    setAnchorElA(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreanchorElA(event.currentTarget);
  };

  const handleLoginOrMobileMenuOpen = (event) => {
    if(isAuthenticated){
      handleMobileMenuOpen(event);
    }
    else
      loginWithRedirect();
      
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorElA}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElA)}
      onClose={handleMenuClose}
      sx={{elevation:3}}
    >
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center'}}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          ID:
        </Typography>
        <Typography >{userData? userData.id : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Surname:
        </Typography>
        <Typography >{userData? userData.surname : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Name:
        </Typography>
        <Typography>{userData? userData.name : ""}</Typography>
      </Box>
      <MenuItem id="logout" onClick={()=>logout({ logoutParams: { returnTo: window.location.origin } })} sx={{mt:"1vw"}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
     
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={setMobileMoreanchorElA}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileMoreAnchorElA)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem id="notifications">
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem id="profile" onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );


  return (
    <Box position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflow:"auto", top:0, left:0, height:"15vh"}}>
      <AppBar sx={{backgroundColor:"#003049"}}>
        <Toolbar  >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display:{xs:'inline',md: 'none'} }}
            onClick={()=>setOpenSelectionsMobile(!openSelectionsMobile)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{display:{xs:'none', md:'inline'}, width:{xs:"0vh",md:"auto"},mx:"1vh",my:"1vh", height:{xs:"0vh",md:"inherit"}, maxWidth:{xs:"0vh",md:"100px"},maxHeight:{xs:"0px",md:"inherit"} }}>
          <Image src={headerBackground} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs:'none',md: 'inline' } }}
          >
            Thesis Proposals
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
              color="inherit">
                <ClockCustomized currentDataAndTime={currentDataAndTime} setCurrentDataAndTime={setCurrentDataAndTime} open={openClock}
                onOpen={handleClockOpen}
                onClose={handleClockClose}/>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleLoginOrMobileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleLoginOrMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}