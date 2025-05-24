/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'anton-sc': ['"Anton SC"', 'sans-serif'],
        'dinish': ['DINish', 'sans-serif'],
      },
      colors: {
        'accent': {
          DEFAULT: '#4C0080',
          dark: '#3B0361',
          20: 'rgba(76, 0, 128, 0.2)',
          alt: '#E9CB88',
        },
        'off-white': '#F4F1EE',
        'brown': {
          DEFAULT: '#796951',
          10: 'rgba(121, 105, 81, 0.1)'
        },
        'lavender': {
          DEFAULT: '#9987D0',
<<<<<<< HEAD:valorant-site/tailwind.config.js
=======
          light: '#E2DCE8',
>>>>>>> a539af89 (fix project folder structure):tailwind.config.js
          pale: 'rgba(153, 135, 208, .2)'
        }
      }
    },
  },
  plugins: [],
};

