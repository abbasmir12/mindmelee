/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-black': '#111111',
        'nav-cream': '#F8F7F2',
        'nav-orange': '#FF552E',
        'nav-blue': '#797EF6',
        'nav-yellow': '#FFC900',
        'nav-lime': '#CCFF00',
        void: '#111111',
        card: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontWeight: {
        black: '900',
      },
    },
  },
  plugins: [],
}
