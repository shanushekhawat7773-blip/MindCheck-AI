/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wellness: {
          50: '#f0fdf9',
          100: '#ccfbe8',
          200: '#9cf7d6',
          300: '#5ee9be',
          400: '#2dd4a3',
          500: '#10b987',
          600: '#05966c',
          700: '#047858',
          800: '#065f47',
          900: '#064e3b',
          950: '#022c22',
        },
        serene: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0f8be7',
          600: '#026fc5',
          700: '#03589f',
          800: '#074b83',
          900: '#0c3f6d',
          950: '#082848',
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 12s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '33%': { transform: 'scale(1.22)', opacity: '1' },
          '66%': { transform: 'scale(1.08)', opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        }
      }
    },
  },
  plugins: [],
}
