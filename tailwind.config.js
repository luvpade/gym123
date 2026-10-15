/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#05070A', // Void black
          900: '#090B10', // Deep space slate
          850: '#0E121B', // Card base
          800: '#111622', // Card elevated
          750: '#161E2E', // Interactive card
          700: '#1F293D', // Borders
          600: '#2F3C54', // Subtle borders
          400: '#7B8DA8', // Muted text
          200: '#C5D1E2', // Secondary text
          100: '#E8EDF5', // Bright text
          50: '#F6F8FC',  // Pure white highlight
        },
        emerald: {
          accent: '#10B981',
          glow: 'rgba(16, 185, 129, 0.25)',
          muted: '#064E3B'
        },
        cyan: {
          accent: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.25)',
          muted: '#164E63'
        },
        amber: {
          accent: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.25)',
          muted: '#78350F'
        },
        violet: {
          accent: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.25)'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'obsidian-glow': '0 0 35px -5px rgba(16, 185, 129, 0.15)',
        'cyan-glow': '0 0 35px -5px rgba(6, 182, 212, 0.2)',
        'amber-glow': '0 0 35px -5px rgba(245, 158, 11, 0.2)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
