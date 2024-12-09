/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1976d2',
          600: '#1565c0',
          700: '#0d47a1',
          800: '#0a2472',
          900: '#051b4c',
        },
        accent: {
          50: '#ffe1ec',
          100: '#ffb3d1',
          200: '#ff80ab',
          300: '#ff4081',
          400: '#f50057',
          500: '#c51162',
          600: '#ad1457',
          700: '#880e4f',
          800: '#6a0c3d',
          900: '#4a0828',
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
