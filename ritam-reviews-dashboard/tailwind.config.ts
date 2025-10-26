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
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0f9c8f",
          700: "#0b766d",
          800: "#0a524c",
          900: "#083a35",
        },
        slate: {
          950: "#0a1121",
        },
      },
      boxShadow: {
        floating: "0 20px 45px -25px rgba(15, 118, 110, 0.55)",
        subtle: "0 12px 30px -12px rgba(15, 23, 42, 0.25)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
