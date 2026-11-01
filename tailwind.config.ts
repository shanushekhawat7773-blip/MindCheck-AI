import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F8F6F1",
          50: "#FCFBF8",
          100: "#F8F6F1",
          200: "#F1EDE3",
          300: "#E8E2D3",
        },
        forest: {
          DEFAULT: "#24483D",
          50: "#EEF4F1",
          100: "#D3E2DB",
          200: "#A2C3B4",
          600: "#2B5649",
          700: "#24483D",
          800: "#1C372E",
          900: "#142620",
        },
        sage: {
          DEFAULT: "#A7B8A1",
          50: "#F4F6F3",
          100: "#E3E9E0",
          200: "#C8D5C3",
          300: "#A7B8A1",
          400: "#8B9F84",
          500: "#708469",
        },
        lavender: {
          DEFAULT: "#DCD7ED",
          50: "#F8F7FC",
          100: "#EFEBF7",
          200: "#DCD7ED",
          300: "#C4BCDE",
          400: "#A499C9",
          500: "#8073AD",
        },
        sand: {
          DEFAULT: "#E9DFD0",
          50: "#FAF7F2",
          100: "#F4EFE6",
          200: "#E9DFD0",
          300: "#D8C7B0",
          400: "#C4AC90",
        },
        charcoal: {
          DEFAULT: "#252925",
          800: "#252925",
          900: "#181A18",
        },
        muted: {
          DEFAULT: "#777B76",
          light: "#9A9E99",
          dark: "#555854",
        },
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(36, 72, 61, 0.05), 0 1px 3px -1px rgba(36, 72, 61, 0.04)",
        card: "0 4px 20px -2px rgba(36, 72, 61, 0.06), 0 2px 6px -1px rgba(36, 72, 61, 0.03)",
        elevated: "0 10px 30px -5px rgba(36, 72, 61, 0.08), 0 4px 10px -2px rgba(36, 72, 61, 0.04)",
      },
      borderRadius: {
        editorial: "1rem",
        "editorial-lg": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
