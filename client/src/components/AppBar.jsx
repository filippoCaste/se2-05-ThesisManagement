import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import headerBackground from "../../public/img/imageedit_3_5228036516.jpg";
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Image from "mui-image";
import Box from '@mui/material/Box';

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
  const {openSelectionsMobile, setOpenSelectionsMobile} = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
  const handleLogout = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
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
        <Typography >Ciccio Caio</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Surname:
        </Typography>
        <Typography >Ciccio Caio</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" >
          Name:
        </Typography>
        <Typography>Ciccio Caio</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontWeight="bold" mr={"0.5vw"} >
          Enrollment Year:
        </Typography>
        <Typography>Ciccio Caio</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontWeight="bold" mr={"0.5vw"} >
          Title Degree:
        </Typography>
        <Typography>Titolo(Codice)</Typography>
      </Box>
      <MenuItem onClick={handleLogout} sx={{mt:"1vw"}}>
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Title of thesis"
              inputProps={{ 'aria-label': 'Title of thesis' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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
              onClick={handleProfileMenuOpen}
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
              onClick={handleMobileMenuOpen}
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