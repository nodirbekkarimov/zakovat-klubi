/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zakovat: {
          gold: '#cba672',
          goldHover: '#b89360',
          dark: '#0f1418',
          card: '#161f24',
          input: '#1e1912',
        },
      },
    },
  },
  plugins: [],
};
