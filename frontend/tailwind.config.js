/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bihar-blue': '#1C4D8D',
        'bihar-blue-dark': '#163c6f',
        'bihar-orange': '#C35504',
        'bihar-orange-light': '#FFF6EF',
        'bihar-gray': '#f8f9fa'
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans Devanagari', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Poppins', 'Noto Sans Devanagari', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
