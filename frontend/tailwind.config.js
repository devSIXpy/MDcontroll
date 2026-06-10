/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#161616',
        'surface-alt': '#1E1E1E',
        border: '#2A2A2A',
        'text-primary': '#F0F0F0',
        'text-secondary': '#888888',
        accent: '#6C63FF',
        'accent-hover': '#574FCC',
        success: '#3DAA6D',
        warning: '#F5A623',
        danger: '#E05C5C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
