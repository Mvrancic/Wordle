/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wordle: {
          correct: '#6aaa64',
          present: '#c9b458',
          absent: '#787c7e',
        }
      }
    },
  },
  plugins: [],
}



