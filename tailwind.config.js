/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saarthi: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // accessible primary teal/blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        },
        accessibility: {
          green: '#15803d',
          amber: '#b45309',
          red: '#b91c1c',
          purple: '#6b21a8',
          teal: '#0f766e',
          blue: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        opendyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif']
      }
    },
  },
  plugins: [],
}
