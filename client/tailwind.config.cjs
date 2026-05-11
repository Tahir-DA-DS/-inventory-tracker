/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // If you already have 'Inter' as sans:
        sans: ['Inter', 'sans-serif'],

        // If you have 'Playwrite AR Guides':
        playwrite: ['Playwrite AR Guides', 'cursive'],

        // Add your new font here
        'rubik-mono': ['Rubik Mono One', 'monospace'], // 'monospace' is the correct fallback as per your snippet
      },
    },
  },
  plugins: [],
}