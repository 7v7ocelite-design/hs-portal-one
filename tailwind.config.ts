import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: {
          DEFAULT: '#12141a',
          hover: '#1a1d24',
        },
        border: {
          DEFAULT: '#2a2d35',
          hover: '#3a3d45',
        },
        athlete: '#3b82f6',
        'high-school': '#d4af37',
        club: '#9333ea',
        'coach-accent': '#c41e3a',
        'portal-gold': '#d4af37',
        'ea-red': '#c41e3a',
        'ea-dark': '#0d0d0d',
        'ea-panel': '#111111',
        'ea-bronze': '#8B5A2B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
