/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        'primary-dark': '#159947',
        background: '#090C15',
        surface: '#1F2933',
        'surface-light': '#252A3A',
        'text-secondary': '#D9D9D9',
        'text-muted': '#6B7280',
        border: '#374151',
      }
    },
  },
  plugins: [],
}
