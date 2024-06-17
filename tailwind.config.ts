import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.indigo["600"],
          medium: colors.indigo["700"],
          dark: colors.indigo["800"],
        },
      },
      fontFamily: {
        "noto-sans-jp": ['var(--font-noto-sans-jp)', 'var(--font-open-sans)'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
