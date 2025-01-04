// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }




module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(220, 90%, 56%)",
        "primary-foreground": "hsl(0, 0%, 100%)",
        border: "hsl(0, 0%, 80%)",
      },
    },
  },
  plugins: [],
};
