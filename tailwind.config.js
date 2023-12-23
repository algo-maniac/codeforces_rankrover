/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        // Simple 8 row grid
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        layout: "200px minmax(900px, 1fr) 100px",
      },
    },
  },
  plugins: [],
};
