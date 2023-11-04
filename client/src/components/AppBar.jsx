import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const AppNavBar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = props.user.id ? true : false;


  const onClickLogin = () => {
    isLoggedIn ? props.logOut() : navigate("/login");
  };

  return (
    <Box sx={{ zIndex: 1, mt: "80px" }}>
      <AppBar component="nav" sx={{ zIndex: 2 }}>
        <Toolbar>
          <Link
            href=""
            onClick={() => {
              navigate("/");
            }}
            variant="h6"
            component="div"
            sx={{
              color: "#fff",
              ":hover": {
                cursor: "pointer",
              },
            }}
          >
            {props.title}
          </Link>

          <Box sx={{ flexGrow: 1 }}></Box>
          {isLoggedIn ? (
            <Typography sx={{ fontWeight: "light", pr: 1 }}>
              Logged in as <b>{props.user.username}</b>
            </Typography>
          ) : (
            <></>
          )}
          {location.pathname == "/" ? (
            <Box>
              <Button sx={{ color: "#fff" }} onClick={onClickLogin}>
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppNavBar;
