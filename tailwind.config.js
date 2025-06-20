/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'muna-primary': '#8A7ADF',
        'muna-secondary': '#6AB09B',
        'muna-bg': '#F8F3EC',
        'muna-text': '#3C3C3C',
        'muna-accent': '#FF9A8D',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
