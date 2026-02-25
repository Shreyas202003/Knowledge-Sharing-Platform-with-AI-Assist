/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Deep slate navy
          foreground: '#F8FAFC',
        },
        secondary: {
          DEFAULT: '#1E293B', // Lighter slate
          foreground: '#94A3B8',
        },
        tertiary: {
          DEFAULT: '#334155', // Inputs
        },
        accent: {
          primary: '#F59E0B',   // Amber
          secondary: '#10B981', // Emerald
          tertiary: '#8B5CF6',  // Violet (AI)
          sky: '#38BDF8',       // Links
        },
        slate: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(245, 158, 11, 0.15)',
      },
      maxWidth: {
        'prose': '65ch',
      }
    },
  },
  plugins: [],
}
