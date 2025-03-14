module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [],
    },
    autoprefixer: {},
  },
}