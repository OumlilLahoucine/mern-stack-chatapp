/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#03bd9d",
        danger: "#ff7782",
      },
      height: {
        screen: "100dvh",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
