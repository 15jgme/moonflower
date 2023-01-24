/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'wave-bg': "url('/svg/layered-waves-haikei.svg')",
      }
    },
  },
  plugins: [],
}
