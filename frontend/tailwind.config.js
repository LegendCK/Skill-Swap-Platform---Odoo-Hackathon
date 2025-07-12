/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3F51B5',
          primaryDark: '#3949AB',
          secondary: '#2ECC71',
          secondaryDark: '#27AE60',
          accentRed: '#E74C3C',
          amber: '#F39C12',
          darkBg: '#121212',
          darkSurface: '#1E1E1E',
          darkText: '#E0E0E0'
        }
      }
    },
  },
  plugins: [],
}

