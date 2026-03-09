import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vintage: {
          creme: "#F5F5DC",
          light_creme: "#FFFDD0",
          green_dark: "#2D5A27",
          green_mid: "#4A7c44",
          green_light: "#8FBC8F",
          sage: "#BC8F8F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
