import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BudgetThuis Brand Colors
        'bt-green': {
          50: '#E6F7F2',
          100: '#CCF0E5',
          200: '#99E1CB',
          300: '#66D2B1',
          400: '#52BC7D', // Secondary Green
          500: '#00AA82', // Primary Brand Green
          600: '#008868',
          700: '#00664E',
          800: '#004434',
          900: '#00221A',
        },
        'bt-dark': {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
        'bt-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'bt': '8px',
        'bt-lg': '12px',
        'bt-xl': '16px',
      },
      boxShadow: {
        'bt': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'bt-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'bt-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
export default config
