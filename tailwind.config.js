/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blanco: 'var(--color-blanco)',
        carbon: 'var(--color-carbon)',
        tiza: 'var(--color-tiza)',
        salvia: 'var(--color-salvia)',
        arena: 'var(--color-arena)',
      },
    },
  },
  plugins: [],
}