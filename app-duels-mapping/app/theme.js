'use client';
import { createTheme } from '@mui/material';

const theme = createTheme({
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
        lineHeight: "1.8em"
      },
  },
});

export default theme;
