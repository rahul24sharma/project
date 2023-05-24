import React, { useState } from "react";
import './Navbar.css'
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const pages = [
  { name: "Home", link: "/" },
  { name: "Play", link: "/play" },
  { name: "All bets", link: "/results" },
  { name: "Signup", link: "/signup" },
  { name: "Login", link: "/login" },
];

const DrawerComp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <React.Fragment>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          {pages.map((page, index) => (
            <Link to={page.link} key={index}>
              <ListItemButton onClick={() => setOpenDrawer(false)}>
                <ListItemIcon>
                  <ListItemText>{page.name}</ListItemText>
                </ListItemIcon>
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Drawer>
      <IconButton
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon color="white" />
      </IconButton>
    </React.Fragment>
  );
};

export default DrawerComp;








