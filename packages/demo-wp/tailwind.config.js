/** @type {import('tailwindcss').Config} */
// import daisyui from 'daisyui';
const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['src/**/*'],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
