import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClockCustomized from './ClockCustomized';
import MoreIcon from '@mui/icons-material/MoreVert';
import headerBackground from "../../public/img/imageedit_3_5228036516.jpg";
import Logout from '@mui/icons-material/Logout';
import Image from "mui-image";
import { AppBar, Toolbar, IconButton, Typography, MenuItem, Menu, ListItemIcon, Box, Badge} from '@mui/material';
import { UserContext } from '../Contexts';
import theme from '../theme';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import notificationsApi from '../services/notifications.api';


export default function PrimarySearchAppBar(props) {
  const {openSelectionsMobile, setOpenSelectionsMobile,currentDataAndTime, setCurrentDataAndTime} = props;
  const [openClock, setOpenClock] = React.useState(false);
  const [anchorElA, setAnchorElA] = React.useState(null);
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();
  const [numOfNotifications, setNumOfNotifications] = React.useState(0);

  
  const handleClockOpen = () => {
    setOpenClock(true);
  };

  const handleClockClose = () => {
    setOpenClock(false);
  };

  const handleProfileMenuOpen = (event) => {
    if(user)
     setAnchorElA(event.currentTarget);
    else window.location.href = "http://localhost:3001/api/users/login";
  };

  const openNotificationsPage = () => {
    navigate('/notifications');
  }

  React.useEffect(() => {
    const getNotifications = async () => {
      try {
        const newNotifications = await notificationsApi.getNotificationsForUser();
        const length = newNotifications.filter((notification) => notification.isRead === 0).length;
        setNumOfNotifications(length);
      } catch (error) {
        handleMessage(error.message, "error");
      }
    };
    
    getNotifications();
  }, []);


  const handleMenuClose = () => {
    setAnchorElA(null);

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
      sx={{ elevation: 3, color: theme.palette.primary.main }}
    >
      <Box sx={{ display:{sm:"flex", md:"none"}, justifyContent: 'center' }}>
                <ClockCustomized currentDataAndTime={currentDataAndTime} setCurrentDataAndTime={setCurrentDataAndTime} open={openClock}
                onOpen={handleClockOpen}
                onClose={handleClockClose}/>
                <IconButton
                size="large"
                edge="end"
                aria-label="notifications"
                onClick={openNotificationsPage}
                color="inherit"
              >
              <Badge color="error" badgeContent={numOfNotifications} ac>
                <NotificationsIcon color="primary.main"/>
              </Badge>
              </IconButton>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>
          User ID:
        </Typography>
        <Typography sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>{user ? user.id : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>
          Surname:
        </Typography>
        <Typography sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>{user ? user.surname : ""}</Typography>
      </Box>
      <Box mx={"1vw"} my={"1vh"} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography mr={"0.5vw"} fontWeight="bold" sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>
          Name:
        </Typography>
        <Typography sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>{user ? user.name : ""}</Typography>
      </Box>
      <MenuItem id="logout" sx={{ mt: "1vw" }}>
        <IconButton href="http://localhost:3001/api/users/logout" >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.main, fontFamily: 'cursive' }}>Logout</Typography>
        </IconButton>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <Box position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, overflow:"none", top:0, left:0, height:"15vh"}}>
      <AppBar sx={{backgroundColor:"#003049"}}>
        <Toolbar  >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display:{xs:(user?.email[0] === 'd') ? 'none' : 'inline',md: 'none'} }}
            onClick={()=>{setOpenSelectionsMobile(!openSelectionsMobile);}}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{display:{xs:(user?.email[0] === 'd') ? 'inline' : 'none', md:'inline'}, width:{xs:(user?.email[0] === 'd') ? 'auto' : '0vw',md:"auto"},mx:"1vw",my:"1vh", height:{xs:(user?.email[0] === 'd') ? 'inherit' : '0vh',md:"inherit"}, maxWidth:{xs:(user?.email[0] === 'd') ? '100px' : '0vw',md:"100px"},maxHeight:{xs:(user?.email[0] === 'd') ? 'inherit' : '0px',md:"inherit"} }}>
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

                <ClockCustomized currentDataAndTime={currentDataAndTime} setCurrentDataAndTime={setCurrentDataAndTime} open={openClock}
                onOpen={handleClockOpen}
                onClose={handleClockClose}/>


              <IconButton
                size="large"
                edge="end"
                aria-label="notifications"
                onClick={openNotificationsPage}
                color="inherit"
              >
              <Badge color="error" badgeContent={numOfNotifications} ac>
                <NotificationsIcon color="primary.main"/>
              </Badge>
              </IconButton>
              {!user ? (<IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              href="http://localhost:3001/api/users/login"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>): (<IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>) }
            
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMenu}
    </Box>
  );
}

PrimarySearchAppBar.propTypes = {
  openSelectionsMobile: PropTypes.bool,
  setOpenSelectionsMobile: PropTypes.func,
  currentDataAndTime: PropTypes.object,
  setCurrentDataAndTime: PropTypes.func
};