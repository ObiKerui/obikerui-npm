/** @type {import('tailwindcss').Config} */
// import daisyui from 'daisyui';
const daisyui = require('daisyui');

module.exports = {
  content: ['src/**/*'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
