import { definePreset } from "@primeng/themes";
import Aura from "@primeng/themes/aura";

export const PosPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#eef8f9",
      100: "#d3edf1",
      200: "#a6dbe3",
      300: "#72c3d1",
      400: "#41a6bb",
      500: "#1f8aa3",
      600: "#0f6d84",
      700: "#0b5566",
      800: "#0a4453",
      900: "#0a3540",
      950: "#062229",
    },
  },
  components: {
    tag: {
      root: {
        fontWeight: "500",
        borderRadius: "999px",
        padding: "2px 10px",
      },
    },
  },
});
