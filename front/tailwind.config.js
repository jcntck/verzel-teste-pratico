/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      width: {
        "car-1/2": "calc(50% - 0.5rem)",
        "car-1/3": "calc(33.333333% - 0.5rem)",
        "car-1/4": "calc(25% - 0.5rem)",
      },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    container: {
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px",
      },
    },
    gridTemplateRows: {
      "min-content": "min-content",
      default: "initial",
    },
    colors: {
      ...colors,
      primary: "#3374db",
      text: "#333",
      light: "#e9eef7",
    },
  },
  variants: {
    // extend: {
    //   scale: ["focus-within"],
    // },
  },
  plugins: [],
};
