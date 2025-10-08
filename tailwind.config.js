/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'flood-blue': '#00A3FF',
        'flood-dark': '#0A1929',
        'flood-darker': '#05121F',
        'flood-cyan': '#00D9FF',
        'flood-navy': '#0D1B2A',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(13, 27, 42, 0.85), rgba(5, 18, 31, 0.95))',
        'alert-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #1B4F72 100%)',
        'city-overlay': 'linear-gradient(to bottom, rgba(13, 27, 42, 0.75) 0%, rgba(5, 18, 31, 0.9) 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'blue-glow': '0 0 30px rgba(0, 163, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
