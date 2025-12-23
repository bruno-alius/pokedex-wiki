import type { Config } from "tailwindcss";

const colorPalette = {
  'transparent': 'transparent',
  'main': '#DD0B4C',
  'accent-1': 'red',
  'accent-2': 'green',
  'accent-3': 'blue',
  'white': '#FFFFFF',
  'black': '#000000'
};


export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {...colorPalette, nav: {
      default: colorPalette["accent-3"],
      hover: colorPalette["accent-1"],
      active: colorPalette["accent-2"],
    }},
    extend: {
      spacing: {
        'nav-sm': '77px',
        'nav-lg': '92px',
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
