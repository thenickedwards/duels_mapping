'use client';

export const baseButtonStyle = (theme, isActive = false, isYear = false) => {
  const isDark = theme.palette.mode === "dark";

  if (isYear) {
    return {
      border: `1px solid ${
        isActive
          ? isDark
            ? "#B7F08E"
            : "#3B5B84"
          : isDark
          ? "#fff"
          : "#000"
      }`,
      backgroundColor: isActive
        ? isDark
          ? "#B7F08E"
          : "#3B5B84"
        : "transparent",
      color: isActive
        ? isDark
          ? "#000"
          : "#fff"
        : isDark
        ? "#fff"
        : "#000",
      "&:hover": {
        border: `1px solid ${isDark ? "#fff" : "#000"}`,
        color: isDark ? "#fff" : "#000",
        backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f2f2f2",
      },
      fontSize: "1rem",
      fontFamily: "'Bebas Neue', 'sans-serif'",
      textTransform: "uppercase",
      borderRadius: 0,
      paddingLeft: "24px",
      paddingRight: "24px",
    };
  }

  // Default button styles
  return {
    border: `1px solid ${isDark ? "#fff" : "#000"}`,
    backgroundColor: isActive
      ? isDark
        ? "#B7F08E"
        : "#000"
      : "transparent",
    color: isActive
      ? isDark
        ? "#000"
        : "#fff"
      : theme.palette.text.primary,
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(255,255,255,0.1)"
        : "#f2f2f2",
    },
    fontSize: "1rem",
    fontFamily: "'Bebas Neue', 'sans-serif'",
    textTransform: "uppercase",
    borderRadius: 0,
    paddingLeft: "24px",
    paddingRight: "24px",
  };
};

