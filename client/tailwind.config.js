/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#172126',
        ocean: '#1e6f86',
        coral: '#d9614c',
        meadow: '#2f7d59',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(23, 33, 38, 0.10)',
      },
    },
  },
  plugins: [],
};
