/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2b6cee",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "surface-dark": "#1e293b",
        "surface-darker": "#111318",
        "border-dark": "#2d3748",
        "editor-bg": "#1e1e1e",
        "editor-sidebar": "#252526",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["Consolas", "Monaco", "Courier New", "monospace"],
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [],
}