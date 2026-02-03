"use client";

// Shared tokens (single source of truth)
const COLORS = {
  grayHover: "#f2f2f2",

  year: {
    light: {
      // Active year (light)
      activeBg: "#3B5B84",
      activeHoverBg: "#324d70",
      activeText: "white",

      // Inactive year (light)
      inactiveBg: "white",
      inactiveBorder: "black",
      inactiveText: "black",
      inactiveHoverBg: "#f2f2f2",
      inactiveHoverText: "black",
    },

    dark: {
      // Active year (dark)
      activeBg: "#B7F08E",
      activeBorder: "#B7F08E",
      activeText: "black",
      activeHoverBg: "white",
      activeHoverBorder: "white",
      activeHoverText: "black",

      // Inactive year (dark)
      inactiveBg: "black",
      inactiveBorder: "white",
      inactiveText: "white",
      inactiveHoverBg: "#26262A",
      inactiveHoverText: "white",
    },
  },

  utility: {
    light: {
      bg: "white",
      border: "black",
      text: "black",
      hoverBg: "#f2f2f2",
      hoverText: "black",
    },
    dark: {
      bg: "black",
      border: "white",
      text: "white",
      hoverBg: "#26262A",
      hoverText: "white",
    },
  },
};

const commonButtonBase = {
  fontSize: "1rem",
  fontFamily: "'Bebas Neue', sans-serif",
  textTransform: "uppercase",
  borderRadius: 0,
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
  "&:active": { boxShadow: "none" },
  "&.Mui-focusVisible": { boxShadow: "none" },
};

//  Utility + Year buttons

export const baseButtonStyle = (
  theme,
  isActive = false,
  isYearButton = false
) => {
  const isDarkMode = theme.palette.mode === "dark";

  // YEAR BUTTONS

  if (isYearButton) {
    // LIGHT MODE
    if (!isDarkMode) {
      const yearColors = COLORS.year.light;

      if (isActive) {
        return {
          ...commonButtonBase,
          px: "24px",
          py: "10px",
          border: "1px solid transparent",
          backgroundColor: yearColors.activeBg,
          color: yearColors.activeText,
          "&:hover": {
            backgroundColor: yearColors.activeHoverBg,
            color: yearColors.activeText,
          },
        };
      }

      return {
        ...commonButtonBase,
        px: "24px",
        py: "10px",
        border: `1px solid ${yearColors.inactiveBorder}`,
        backgroundColor: yearColors.inactiveBg,
        color: yearColors.inactiveText,
        "&:hover": {
          backgroundColor: yearColors.inactiveHoverBg,
          color: yearColors.inactiveHoverText,
        },
      };
    }

    // DARK MODE
    const yearColors = COLORS.year.dark;

    if (isActive) {
      return {
        ...commonButtonBase,
        px: "24px",
        py: "10px",
        border: `1px solid ${yearColors.activeBorder}`,
        backgroundColor: yearColors.activeBg,
        color: yearColors.activeText,
        "&:hover": {
          borderColor: yearColors.activeHoverBorder,
          backgroundColor: yearColors.activeHoverBg,
          color: yearColors.activeHoverText,
        },
      };
    }

    return {
      ...commonButtonBase,
      px: "24px",
      py: "10px",
      border: `1px solid ${yearColors.inactiveBorder}`,
      backgroundColor: yearColors.inactiveBg,
      color: yearColors.inactiveText,
      "&:hover": {
        backgroundColor: yearColors.inactiveHoverBg,
        color: yearColors.inactiveHoverText,
      },
    };
  }

  // UTILITY BUTTONS (Filters / Columns / Export)

  const utilityColors = isDarkMode ? COLORS.utility.dark : COLORS.utility.light;

  return {
    ...commonButtonBase,
    px: "20px",
    border: `1px solid ${utilityColors.border}`,
    backgroundColor: utilityColors.bg,
    color: utilityColors.text,
    "&:hover": {
      backgroundColor: utilityColors.hoverBg,
      color: utilityColors.hoverText,
    },
  };
};

//  Primary action button (contained CTA)

export const primaryActionButtonStyle = (theme) => {
  const isDarkMode = theme.palette.mode === "dark";
  const yearColors = isDarkMode ? COLORS.year.dark : COLORS.year.light;

  return {
    ...commonButtonBase,
    px: "40px",
    py: "10px",
    border: "1px solid transparent",
    backgroundColor: yearColors.activeBg,
    color: yearColors.activeText,
    letterSpacing: "0.00735em",
    "&:hover": {
      boxShadow: "none",
      backgroundColor: isDarkMode
        ? yearColors.activeHoverBg
        : yearColors.activeHoverBg,
      borderColor: isDarkMode ? yearColors.activeHoverBorder : "transparent",
      color: isDarkMode ? yearColors.activeHoverText : yearColors.activeText,
    },
  };
};

export const textActionButtonStyle = (theme) => ({
  fontSize: "1rem",
  letterSpacing: "0.00735em",
  fontFamily: "'Bebas Neue', sans-serif",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
  padding: 0,
  minWidth: "auto",
  border: 0,
  backgroundColor: "transparent",

  "&:hover": {
    backgroundColor: "transparent",
    opacity: 0.7,
  },

  "&:active": {
    backgroundColor: "transparent",
    opacity: 0.7,
  },

  "&.Mui-focusVisible": {
    backgroundColor: "transparent",
    opacity: 0.7,
  },
});

export { COLORS };
