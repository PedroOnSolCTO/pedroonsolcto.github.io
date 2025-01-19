/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pedro-red': '#FF6046',
        'pedro-dark': '#1F2122',
      },
    },
  },
  plugins: [],
}
