/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary":                   "#006d37",
        "primary-container":         "#2ecc71",
        "on-primary-container":      "#005027",
        "primary-fixed-dim":         "#4ae183",
        "secondary":                 "#9b4500",
        "secondary-container":       "#fc8a40",
        "on-secondary-container":    "#672c00",
        "tertiary-container":        "#4bca78",
        "on-tertiary-container":     "#005127",
        "surface":                   "#f9f9f8",
        "surface-container-lowest":  "#ffffff",
        "surface-container-low":     "#f3f4f3",
        "surface-container":         "#edeeed",
        "surface-container-high":    "#e7e8e7",
        "surface-container-highest": "#e1e3e2",
        "on-surface":                "#191c1c",
        "on-surface-variant":        "#3d4a3e",
        "outline":                   "#6c7b6d",
        "outline-variant":           "#bbcbbb",
        "background":                "#f9f9f8",
        "error":                     "#ba1a1a",
        "error-container":           "#ffdad6",
      },
      fontFamily: {
        headline: ["Lexend", "sans-serif"],
        body:     ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
