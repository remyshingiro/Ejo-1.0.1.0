/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ejo-green': '#10b981',
        'ejo-dark': '#1f2937',
      }
    },
  },
  plugins: [],
}