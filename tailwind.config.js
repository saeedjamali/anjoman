/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      fontFamily: {
        iranyekan: ["iranyekan"],
        iranyekanMedium: ["iranyekanMedium"],
        iranyekanBold: ["iranyekanBold"],
        shabnam: ["shabnam"],
        shabnamBold: ["shabnamBold"],
        iranSans: ["iransans"],
        vazir: ["Vazirmatn"],
        iranNastaliq: ["iranNastaliq"]
       

      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        slideIn: "slideIn .25s ease-in-out forwards",
      },
      colors: {
        //just add this below and your all other tailwind colors willwork
        primary_color: "#2AD4FF",
        secondary_color: "#8080FF",
        "header-font-color": "#5F6069",
        header: "#F5F6FF",
        "btn-primary": "#4A43EC",
        "btn-secondary": "#F5F6FF",
        "btn-font-secondary": "#919CA7",
        footer: "#e4e5ed",
        "header-second": "#f0f0f5",
      },
      // backgroundImage: {
      //   'hero-pattern': "url('/images/6856.jpg')",
      // }
    },
  },
  plugins: [nextui()],
};
