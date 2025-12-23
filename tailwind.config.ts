import type { Config } from "tailwindcss";

const colorPalette = {
  bg: '#47bbe5ff',
  card: '#fffff7ff',
  'card-border': '#e1e0dbff',
  'option': '#edf1cfff',
  'option-border': '#b9c19fff',
};


export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {...colorPalette,},
    extend: {
      spacing: {
        'nav-sm': '92.4px',
        'nav-lg': '110.4px',
      },
      fontSize: {
        'h1': '3.0518em',
        'h2': '2.441em',
        'h4': '1.953em',
        'h5': '1.563em',
        'h6': '1.25em',
        'p': '1em',
      }
    },
  },
  plugins: [],
} satisfies Config;
