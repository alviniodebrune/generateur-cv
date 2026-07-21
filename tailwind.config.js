/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F6F3",
        navy: "#1E3A5F",
        navydark: "#142943",
        gold: "#B8912F",
        ink: "#1A1A1A",
        inksoft: "#5B6470",
        line: "#DADCD6",
        red: "#B3402F",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
