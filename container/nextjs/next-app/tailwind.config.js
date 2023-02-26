/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "grafana-black": "#111216",
        "astar-pink": "#C6279B",
        "astar-purple": "#694CCE",
        "astar-blue": "#02E3FF",
      },
    },
  },
  plugins: [],
};
