import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import useLogout from "../hooks/useLogout"; // Import useAuth

const drawerStyles = css`
  width: 250px;
`;

const MenuButton = styled(IconButton)`
  margin-left: auto;
`;

const MobileAppBar = ({ showBackButton }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가

  const {
    logoutDialogOpen,
    handleLogoutDialogOpen,
    handleLogoutDialogClose,
    handleLogout,
  } = useLogout(); // 커스텀 훅

  useEffect(() => {
    const handleLoginStatusChange = () => {
      const loginInfo = localStorage.getItem("loginInfo");
      if (loginInfo) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    // 컴포넌트 마운트 시 초기 로그인 상태 확인
    handleLoginStatusChange();

    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    isLoggedIn
      ? { text: "관리자보드", link: "/admins/dashboard" }
      : { text: "관리자로그인", link: "/admins/login" },
    isLoggedIn && { text: "로그아웃", onClick: handleLogout },
  ].filter(Boolean);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar>
        {showBackButton ? (
          <Link href="/" passHref>
            <IconButton edge="start" color="inherit" aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
        ) : (
          <Link href="/" passHref>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
              <img src="/cart.png" alt="logo" width="30" />
            </Typography>
          </Link>
        )}
        <MenuButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </MenuButton>
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div css={drawerStyles}>
          <List>
            {menuItems.map((item, index) =>
              item.link ? (
                <Link key={index} href={item.link} passHref>
                  <ListItemButton onClick={toggleDrawer(false)}>
                    <ListItemText primary={item.text} sx={{ color: "black" }} />
                  </ListItemButton>
                </Link>
              ) : (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    toggleDrawer(false)();
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                >
                  <ListItemText primary={item.text} sx={{ color: "black" }} />
                </ListItemButton>
              )
            )}
          </List>
        </div>
      </Drawer>
    </AppBar>
  );
};

export default MobileAppBar;
