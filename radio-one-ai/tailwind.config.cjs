/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#F3F8FF",
          secondary: "#E5F0FF",
          card: "#FFFFFF",
          elevated: "#D8E8FF",
        },
        border: "#C2D7F5",
        text: {
          primary: "#06204D",
          secondary: "#3B5377",
          muted: "#7895B0",
        },
        brand: {
          blue: "#1C7CFF",   // primary action
          cyan: "#00B4FF",   // secondary blue
          indigo: "#4A5CFF", // tertiary blue
          green: "#14D1A4",  // success
          yellow: "#FFC44D", // warning
          red: "#FF5463",    // error
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
