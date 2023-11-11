import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ClockCustomized from './ClockCustomized';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import headerBackground from "../../public/img/imageedit_3_5228036516.jpg";
import Logout from '@mui/icons-material/Logout';
import Image from "mui-image";
import { Autocomplete, AppBar, Toolbar, IconButton, Typography, Badge, MenuItem, Menu , TextField, ListItemIcon, Box} from '@mui/material';
import { UserContext } from '../Contexts';
import { useAuth0 } from "@auth0/auth0-react";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const {openSelectionsMobile, setOpenSelectionsMobile,currentDataAndTime, setCurrentDataAndTime, proposals} = props;
  const [openClock, setOpenClock] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const { user } = React.useContext(UserContext);

    const handleClockOpen = () => {
    setOpenClock(true);
  };

  const handleClockClose = () => {
    setOpenClock(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
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
      anchorEl={anchorEl}
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
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{elevation:3}}
    >
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center'}}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          ID:
        </Typography>
        <Typography >{user? user.id : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Surname:
        </Typography>
        <Typography >{user? user.surname : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Name:
        </Typography>
        <Typography>{user? user.name : ""}</Typography>
      </Box>
      <MenuItem onClick={()=>logout({ logoutParams: { returnTo: window.location.origin } })} sx={{mt:"1vw"}}>
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
      anchorEl={mobileMoreAnchorEl}
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
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
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
      <MenuItem onClick={handleProfileMenuOpen}>
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
          <Box sx={{ flexGrow: 0.5 }} />
          <Autocomplete 
          id="combo-box-demo"
          options={proposals.map((proposal) => proposal.title)}
          sx={{
            width: 300,
            ".MuiAutocomplete-inputRoot": {
              backgroundColor: 'white',
            },
            ".MuiInputLabel-root": {
              backgroundColor: 'white', // Set the background color for the label
            },
          }}
          renderInput={(params) => <TextField {...params} label="Thesis title" />}
        />


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