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
        noah: {
          black: "#050505",
          dark: "#0A0A0B",
          panel: "#111113",
          border: "#1F1F23",
          muted: "#A1A1AA",
          blue: "#2563EB",
          violet: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ['Arial'], // Police par défaut
        display: ['Arial'], // Pour tes titres (font-display)
      },
    },
  },
  plugins: [],
};

export default config;