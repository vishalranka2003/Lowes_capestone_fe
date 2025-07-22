/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        lowesBlue: {
          500: 'rgb(1,33,105)',
          600: 'rgb(1,33,105)',
          700: 'rgb(1,33,105)',
        },
        lowesWhite: '#ffffff',
      },
    },
  },
  plugins: [],
}

