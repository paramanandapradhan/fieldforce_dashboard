/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/@cloudparker/moldex.js/**/*.{svelte,js,ts}',
    "./src/app.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode class
  theme: {
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary-600)",
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        base: {
          DEFAULT: "var(--color-base-600)",
          50: "var(--color-base-50)",
          100: "var(--color-base-100)",
          200: "var(--color-base-200)",
          300: "var(--color-base-300)",
          400: "var(--color-base-400)",
          500: "var(--color-base-500)",
          600: "var(--color-base-600)",
          700: "var(--color-base-700)",
          800: "var(--color-base-800)",
          900: "var(--color-base-900)",
          950: "var(--color-base-950)",
        },
      },
    },
  },

  plugins: [

  ],
}

