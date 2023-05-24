import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.png";
import logo2 from "../logo2.jpeg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
import Menu from "@mui/material/Menu"
import IconButton from "@mui/material/IconButton";

import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerComp from "./Drawer";
const Navbar = (props) => {
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    props.handleSignOut();
    navigate("/");
  };
  return (
    <React.Fragment>
      <AppBar sx={{ background: "#000000" }}>
        <Toolbar>
          <img
            src={logo}
            alt="AvaitorCrash logo"
            height={25}
            width={200}
            sx={{ fontSize: "2rem", paddingLeft: "10%" }}
          />{" "}
          {isMatch ? (
            <>
              <Typography sx={{ fontSize: "2rem", paddingLeft: "0%" }}>
                <img
                  src={logo2}
                  height={50}
                  width={100}
                  sx={{ transform: "scale(2)", marginLeft: "20%" }}
                />
              </Typography>
              <DrawerComp />
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                <Tab component={Link} to="/" label="home" />
                <Tab component={Link} to="/play" label="play" />
                <Tab component={Link} to="/results" label="all bets" />
              </Tabs>
              {!props.name ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{ marginLeft: "auto" }}
                    variant="outlined"
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    sx={{ marginLeft: "10px" }}
                    variant="outlined"
                  >
                    SignUp
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSignOut}
                  sx={{ marginLeft: "auto" }}
                  variant="outlined"
                >
                  Logout
                </Button>
              )}

              {auth && (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
