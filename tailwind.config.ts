import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // The one accent colour, matching the app icon and theme_color. Used
        // sparingly — the interface is warm stone, and wine is for the moments
        // that should draw the eye.
        wine: {
          50: "#FBF4F5",
          100: "#F5E4E7",
          600: "#8A2E42",
          700: "#6B2233",
          800: "#551B29",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
