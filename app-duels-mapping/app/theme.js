"use client";

import { createTheme } from "@mui/material/styles";
import { useMemo, useState, createContext, useContext } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

// Define light and dark color schemes
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#ffffff",
            paper: "#f5f5f5",
          },
          text: {
            primary: "#000000",
          },
        }
      : {
          background: {
            default: "#121212",
            paper: "#1e1e1e",
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
    body1: {
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 400,
      fontSize: "1.375rem",
      lineHeight: "1.8em",
    },
  },
});

// Create context to toggle mode from NavBar
const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
