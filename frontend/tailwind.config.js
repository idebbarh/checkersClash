/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cell-can-accept-piece-bg": "#74b1be",
        "cell-cannot-accept-piece-bg": "#d7ebef",
        "player-one-piece-color": "#7d8888",
        "player-two-piece-color": "#ffffff",
        "piece-border": "#373e40",
        "board-green": "#ceff62",
      },
      boxShadow: {
        boardShadow: "0 0 20px rgba(255, 255, 255, 0.7)",
        redShadow: "0px 0px 10px rgba(232, 28, 31, 0.7)",
      },
    },
  },
  plugins: [],
};
