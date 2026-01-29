import { createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      categoryPill: {
        bg: string;
        bgHover: string;
        text: string;
        icon: string;
      };
      hero: {
        from: string;
        to: string;
      };
      nav: {
        bg: string;
      };
      footer: {
        bg: string;
      };
      border: {
        subtle: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: Theme["custom"];
  }
}

export function getTheme(mode: ColorMode) {
  const isDark = mode === "dark";

  const primaryMain = "#6D28D9";
  const primaryDark = "#3B0764";
  const primaryLight = "#8B5CF6";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: primaryMain,
        dark: primaryDark,
        light: primaryLight,
        contrastText: "#FFFFFF",
      },

      // Use secondary as a "soft surface tint", not another loud brand
      secondary: {
        main: isDark ? "#1B1630" : "#F3E8FF",
      },

      background: {
        default: isDark ? "#0B0B12" : "#F7F7FB",
        paper: isDark ? "#111827" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#F8FAFC" : "#0F172A",
        secondary: isDark ? "#CBD5E1" : "#475569",
      },

      divider: isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB",

      // Don't leave these as MUI defaults — marketplaces need states
      success: { main: "#16A34A" },
      warning: { main: "#F59E0B" },
      error: { main: "#DC2626" },
      info: { main: "#2563EB" },
    },

    custom: {
      categoryPill: {
        bg: isDark ? "rgba(139, 92, 246, 0.18)" : "#EDE9FE",
        bgHover: isDark ? "rgba(139, 92, 246, 0.28)" : "#DDD6FE",
        text: isDark ? "#F8FAFC" : "#4C1D95",
        icon: isDark ? "rgba(248,250,252,0.8)" : "rgba(76,29,149,0.7)",
      },

      hero: {
        from: "#2E1065",
        to: "#7C3AED",
      },

      nav: {
        bg: isDark ? "#120A2A" : primaryDark, // your screenshot header vibe
      },

      footer: {
        bg: isDark ? "#0F172A" : "#ECECF1",
      },

      border: {
        subtle: isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB",
      },
    },

    shape: { borderRadius: 16 },

    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.custom.border.subtle,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
              borderWidth: 2,
            },
          }),
        },
      },

      MuiButtonBase: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&.Mui-focusVisible": {
              outline: `2px solid ${theme.palette.primary.light}`,
              outlineOffset: 2,
            },
          }),
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 999,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: "1px solid",
            borderColor: theme.custom.border.subtle,
          }),
        },
      },
    },
  });
}
