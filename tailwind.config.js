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
        // JuriBank Professional Banking Colors
        'juribank-navy': '#0D1B2A',
        'juribank-gold': '#F4C430',
        'juribank-off-white': '#FAFAFA',
        'juribank-gray': '#D9D9D9',
        'navy-dark': '#081117',
        'navy-light': '#1a2b3a',
        'gold-light': '#f6d155',
        'gold-dark': '#e6b520',
        'text-dark': '#2d3748',
        'text-light': '#718096',
        'security-green': '#059669',
        'warning-amber': '#d97706',
        'alert-red': '#dc2626',
        // JuriBank Modern Brand Colors (Legacy Support)
        'juribank': {
          'charcoal': '#121212',
          'blue': '#3A86FF',
          'background': '#F4F4F4',
          'alert': '#E63946',
          'success': '#0B8B6E',
        },
        // Extended Palette for depth
        'charcoal': {
          'light': '#2D3748',
          'dark': '#0A0A0A',
        },
        'blue': {
          'light': '#5A9AFF',
          'dark': '#2A76EF',
        },
        'gray': {
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F2937',
          '900': '#111827',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Monaco', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'juribank': '16px',
        'card': '16px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(18, 18, 18, 0.1), 0 2px 4px -1px rgba(18, 18, 18, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(18, 18, 18, 0.1), 0 4px 6px -2px rgba(18, 18, 18, 0.05)',
        'card-xl': '0 20px 25px -5px rgba(18, 18, 18, 0.1), 0 10px 10px -5px rgba(18, 18, 18, 0.04)',
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