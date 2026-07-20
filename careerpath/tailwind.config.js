/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#14B8A6',
          hover: '#0d9488',
          soft: '#E6FAFA',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#ea580c',
        },
        darkText: '#1F2937',
        lightBg: '#F9FAFB',
      },
    },
  },
  plugins: [],
}
