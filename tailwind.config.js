/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thc: {
          dark: '#090C12',
          surface: '#111724',
          surfaceLight: '#192236',
          border: '#232E45',
          gold: '#F59E0B',
          goldHover: '#D97706',
          goldLight: '#FDE68A',
          red: '#EF4444',
          cyan: '#06B6D4',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Inter"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.35)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.35)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
