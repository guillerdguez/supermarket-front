import { definePreset } from "@primeng/themes";
import Aura from "@primeng/themes/aura";

export const PosPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#eef8f9",
      100: "#d3edf1",
      200: "#a6dbe3",
      300: "#7bc9d4",
      400: "#4fb0c4",
      500: "#1f8aa3",
      600: "#0f6d84",
      700: "#0b5566",
      800: "#083d4a",
      900: "#0a3540",
      950: "#062229",
    },

    transitionDuration: "0.2s",

    focusRing: {
      width: "2px",
      style: "solid",
      color: "{primary.400}",
      offset: "2px",
      shadow: "none",
    },

    colorScheme: {
      light: {
        primary: {
          color: "{primary.500}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
        },

        surface: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },

        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.100}",
          color: "{primary.700}",
          focusColor: "{primary.800}",
        },
      },

      dark: {
        primary: {
          color: "{primary.400}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.300}",
          activeColor: "{primary.200}",
        },

        surface: {
          0: "#ffffff",
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
          950: "#ffffff",
        },
      },
    },
  },

  components: {
    tag: {
      root: {
        borderRadius: "999px",
      },
    },

    button: {
      root: {
        borderRadius: "8px",
      },
    },

    card: {
      root: {
        borderRadius: "12px",
      },
    },

    inputtext: {
      root: {
        borderRadius: "8px",
      },
    },

    dialog: {
      root: {
        borderRadius: "16px",
      },
    },
  },
});
