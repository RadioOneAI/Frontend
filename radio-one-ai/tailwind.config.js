import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        muted: "#64748B",
        border: "#E2E8F0",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        hospital: {
          primary: "#1E88E5",
          secondary: "#00BFA5",
          accent: "#00BFA5",
          neutral: "#0F172A",
          "base-100": "#F7FAFC",
          "base-200": "#FFFFFF",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
          success: "#2E7D32",
          warning: "#F9A825",
          error: "#D32F2F",
          info: "#1E88E5",
        },
      },
      "night",
    ],
  },
};
