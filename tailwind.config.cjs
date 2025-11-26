/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: "class",
  content: [
    './*.html',
    './src/**/*.{vue,js,jsx,ts,tsx,html}',
    './node_modules/@ue/**/*.{vue,js,jsx,ts,tsx}',
  ],
  theme: {
  },
  plugins: [
    plugin(function({ matchVariant }) {
      if (matchVariant) {
        matchVariant('deep', (value) => {
          return `& ${value}`;
        }, {
          values: {}
        });
      }
    })
  ]
}
