import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        water: {
          50: '#F7FBFF',
          100: '#EBF8FE',
          200: '#D1ECFD',
          300: '#B8E0F6',
          400: '#7FC7EE',
          500: '#22D3EE',
          600: '#0EA5E9',
          700: '#0369A1',
          800: '#0B5B7E',
          900: '#0B1F33',
        }
      },
      spacing: {
        '2px': '2px',
      }
    },
  },
  plugins: [],
}

export default config
