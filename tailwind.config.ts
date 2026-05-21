import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#eaeefe",
          500: "#4f6bff",
          600: "#3a55ec",
          700: "#2c41c2",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
