"use client";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Switch,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useColorMode } from "@/app/theme";
import DarkMode from "../../public/images/dark_mode.png";
import LightMode from "../../public/images/light_mode.png";

const pages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Methods", href: "/methods" },
];

export default function NavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Site Name
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItemButton key={page.label} component={Link} href={page.href}>
            <ListItemText primary={page.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "#000" : "#fff",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            🏠 Site Name
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {pages.map((page) => {
                const isActive = pathname === page.href;

                return (
                  <Button
                    key={page.label}
                    color="inherit"
                    component={Link}
                    href={page.href}
                    sx={{
                      fontSize: "1.25rem",
                      fontFamily: "'Bebas Neue', 'sans-serif'",
                      letterSpacing: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          height: "4px",
                          width: "100%",
                          backgroundColor: isActive ? "#B7F08E" : "#3B5B84",
                          borderRadius: 0,
                          transformOrigin: "left",
                          transform: isActive ? "scaleX(1)" : "scaleX(0)",
                          transition:
                            "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                        },
                      }}
                    >
                      {page.label}
                    </Box>
                  </Button>
                );
              })}

              <IconButton onClick={toggleColorMode} color="inherit">
                <Image
                  src={mode === "light" ? LightMode : DarkMode}
                  alt="Toggle theme"
                  height={24}
                />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
