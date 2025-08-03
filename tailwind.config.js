/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.claude/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        // JuriBank Brand Colors
        'juribank': {
          'navy': '#0D1B2A',
          'gold': '#F4C430',
          'off-white': '#FAFAFA',
          'gray': '#D9D9D9',
        },
        // Extended Palette
        'navy': {
          'dark': '#081117',
          'light': '#1a2b3a',
        },
        'gold': {
          'light': '#f6d155',
          'dark': '#e6b520',
        },
        'text': {
          'dark': '#2d3748',
          'light': '#718096',
        }
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'mono': ['Monaco', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'juribank': '0.375rem',
      },
      boxShadow: {
        'juribank': '0 4px 6px -1px rgba(13, 27, 42, 0.1), 0 2px 4px -1px rgba(13, 27, 42, 0.06)',
        'juribank-lg': '0 10px 15px -3px rgba(13, 27, 42, 0.1), 0 4px 6px -2px rgba(13, 27, 42, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}