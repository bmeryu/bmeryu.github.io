// postcss.config.js
const tailwindConfig = require('./tailwind.config.js');

module.exports = {
  plugins: [
    require('postcss-import'), // Added postcss-import
    require('@tailwindcss/postcss')(tailwindConfig),
    // require('autoprefixer'), // If autoprefixer is needed, it would go here
  ]
};
