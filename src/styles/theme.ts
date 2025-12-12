export const theme = {
  colors: {
    primary: "#646cff",
    primaryHover: "#535bf2",
    background: "#242424",
    backgroundSecondary: "#1a1a1a",
    text: "rgba(255, 255, 255, 0.87)",
    textMuted: "#888",
    border: "rgba(255, 255, 255, 0.1)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  typography: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontSize: {
      base: "16px",
      sm: "14px",
      lg: "18px",
      xl: "20px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
    },
  },
  transitions: {
    fast: "150ms ease",
    normal: "200ms ease",
  },
  layout: {
    maxWidth: "1200px",
    headerHeight: "60px",
  },
} as const;

export type Theme = typeof theme;
