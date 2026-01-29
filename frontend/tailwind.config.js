/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Patrick Hand"', 'cursive', 'sans-serif'],
        display: ['"Permanent Marker"', 'cursive'],
      },
      colors: {
        paper: '#fdfbf7', // Warm paper color
        ink: {
          400: '#6b7280',
          500: '#374151',
          900: '#111827',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      boxShadow: {
        'sketch': '2px 2px 0px 0px rgba(0,0,0,0.8)',
        'sketch-hover': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'sketch-lg': '6px 6px 0px 0px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'paper-lines': "repeating-linear-gradient(transparent 0px, transparent 24px, #a5b4fc 25px)",
      },
      animation: {
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}
