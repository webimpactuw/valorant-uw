/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],

  theme: {
    extend: {
      fontFamily: {
        'anton-sc': ['"Anton SC"', 'sans-serif'],
        'dinish':    ['DINish',     'sans-serif'],
      }
    }
  }
}

