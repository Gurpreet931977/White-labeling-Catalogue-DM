/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dripp: {
          yellow: '#ebd73f',
          yellowLight: '#fff37a',
          yellowDark: '#d4bf1d',
          dark: '#080808',
          darker: '#040404',
          surface: '#111111',
          surfaceLight: '#181818',
          border: 'rgba(255, 255, 255, 0.09)',
          muted: '#8e8e8e',
        },
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
        },
        oxblood: {
          DEFAULT: '#7A1F1F',
          dark: '#5C1414',
          deep: '#470D0D',
          hover: '#8F2828',
        },
        cream: {
          DEFAULT: '#F2ECD8',
          light: '#FAF6EA',
          dark: '#E2D8BE',
          border: '#D8CEB0',
        },
        mustard: {
          DEFAULT: '#E5A93C',
          dark: '#C98D25',
          light: '#F8CF75',
          gold: '#D48B1C',
        },
        ink: {
          DEFAULT: '#1F1614',
          dark: '#140D0C',
          light: '#362926',
        }
      },
      fontFamily: {
        groovy: ['"Lilita One"', '"Bagel Fat One"', '"Boogaloo"', 'cursive', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Lilita One"', '"Panchang"', '"Clash Display"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        clash: ['"Clash Display"', 'sans-serif'],
        panchang: ['"Panchang"', 'sans-serif'],
        fraunces: ['"Fraunces"', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-yellow': '0 0 25px -5px rgba(235, 215, 63, 0.45)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.35)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
