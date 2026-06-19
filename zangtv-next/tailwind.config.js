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
        void:    '#07060F',
        deep:    '#0D0C1A',
        surface: '#141328',
        card:    '#1A1930',
        hover:   '#1F1E38',
        accent: {
          DEFAULT: '#7C5CFF',
          hover:   '#6A4AEE',
        },
        pink: {
          DEFAULT: '#FF5CAA',
          hover:   '#EE4A99',
        },
        live:  '#FF3B5C',
        gold:  '#FFB830',
      },
      fontFamily: {
        ku: ['Readex Pro', 'Noto Sans Arabic', 'sans-serif'],
        en: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
