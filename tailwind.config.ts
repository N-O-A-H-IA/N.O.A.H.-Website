// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",  // ← TRÈS IMPORTANT
  ],
  theme: {
    extend: {
      colors: {
        'noah-black': '#050505',
        'noah-panel': 'rgba(255, 255, 255, 0.05)',
        'noah-border': 'rgba(255, 255, 255, 0.1)',
        'noah-muted': 'rgba(255, 255, 255, 0.6)',
        'noah-violet': '#8B5CF6',
        'noah-blue': '#2563EB',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        display: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;