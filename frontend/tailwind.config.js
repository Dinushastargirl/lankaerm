/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#dfa5ff', // Main pink fill color from image
          600: '#9f3eff', // Main purple-pink line color from image
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#2e054e',
        },
        brand: {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e5e5e5',
          300: '#cccccc',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a', // Deep neutral black
        },
        slate: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1a1a1a', // Custom dark grey borders
          900: '#121212', // Clinical dark grey panel backgrounds
          950: '#050505', // Pure neutral black page backgrounds
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
