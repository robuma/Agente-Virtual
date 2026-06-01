import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        cloud: "#f6f8fb",
        brand: {
          50: "#eef8ff",
          100: "#d9efff",
          500: "#1b8dd9",
          600: "#0f72ba",
          700: "#0b5f9c"
        },
        mint: {
          100: "#dff8eb",
          500: "#1aa36f",
          700: "#0d7650"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 41, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
