/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  trailingComma: 'es5', // Use trailing commas wherever possible
  singleQuote: true,    // Use single quotes for strings
  printWidth: 80,       // Maximum line width
  tabWidth: 2,          // Number of spaces per indentation level  
};

module.exports = config;
