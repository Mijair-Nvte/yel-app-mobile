/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Marca
        negro: 'rgb(var(--color-negro) / <alpha-value>)',
        blanco: 'rgb(var(--color-blanco) / <alpha-value>)',
        // Neutros de interfaz
        carbon: 'rgb(var(--color-carbon) / <alpha-value>)',
        grafito: 'rgb(var(--color-grafito) / <alpha-value>)',
        gris: 'rgb(var(--color-gris) / <alpha-value>)',
        niebla: 'rgb(var(--color-niebla) / <alpha-value>)',
        humo: 'rgb(var(--color-humo) / <alpha-value>)',
        // Alias temporales de la paleta anterior
        tiza: 'rgb(var(--color-tiza) / <alpha-value>)',
        salvia: 'rgb(var(--color-salvia) / <alpha-value>)',
        arena: 'rgb(var(--color-arena) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};