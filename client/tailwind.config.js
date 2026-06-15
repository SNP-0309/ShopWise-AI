/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          light: '#8B84FF',
          dark: '#5048E5',
        },
        accent: '#06B6D4',
        shopwise: {
          purple: '#6C63FF',
          violet: '#A855F7',
          cyan: '#06B6D4',
          amber: '#F59E0B',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(108, 99, 255, 0.25)',
        'glow-lg': '0 0 60px rgba(108, 99, 255, 0.35)',
        'product': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
  darkMode: ['selector', '[data-theme="dark"]'],
}
