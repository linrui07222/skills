/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        emerald: { 600: '#0D9373', 700: '#0A7A60', 500: '#10B981' },
        gold: { 400: '#F5A623', 500: '#E09500' },
        cream: '#FAFAF5',
        charcoal: '#1A1A2E',
        royal: '#4169E1',
        sakura: '#FFB7C5',
        sky: '#87CEEB',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
