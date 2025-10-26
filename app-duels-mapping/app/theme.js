"use client";

import { createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

// Function to generate design tokens
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#ffffff",
            paper: "#ffffff",
          },
          text: {
            primary: "#000000",
          },
        }
      : {
          background: {
            default: "#000000",
            paper: "#000000",
          },
          text: {
            primary: "#ffffff",
          },
        }),
  },
  typography: {
    h1: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 400,
    },
    h2: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 400,
    },
    h3: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 400,
    },
    h4: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 400,
    },
    body1: {
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: "1.5em",
    },
    body2: {
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 400,
      fontSize: "0.9rem",
      lineHeight: "1.5em",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
           borderRadius: 0,
           boxShadow: "none",
          "&.MuiDataGrid-paper": {
            marginTop: "10px",
          },
          "& .MuiSvgIcon-root": {
            color: mode === "dark" ? "#fff" : "#000",
          },
        },
      },
    },
     MuiPopper: {
      styleOverrides: {
        root: {
          "&.MuiDataGrid-menu": {
            border: `1px solid ${mode === "dark" ? "#fff" : "#000"}`,
          },
          "& .MuiSvgIcon-root": {
            color: mode === "dark" ? "#fff" : "#000",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: mode === "dark" ? "#333" : "#f0f0f0", 
          },
        },
      },
    },
        
  },
});

// Context to provide mode + toggle
const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  // On mount, set mode based on localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("preferred-mode");
    if (stored) {
      setMode(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("preferred-mode", next);
          return next;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
