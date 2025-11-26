module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  ignoreFiles: [
    '**/node_modules/**/*.css',
  ]
}
