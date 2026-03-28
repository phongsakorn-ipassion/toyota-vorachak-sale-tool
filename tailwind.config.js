/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1B7A3F', dark: '#145E30', light: '#EBF7EF', medium: '#C4E3CE' },
        avail: '#16A34A',
        transit: '#EA580C',
        hot: '#DC2626',
        warm: '#D97706',
        cool: '#2563EB',
        won: '#10B981',
        t1: '#111827',
        t2: '#6B7280',
        t3: '#9CA3AF',
        bg: '#F5F7F5',
        card: '#FFFFFF',
        border: '#E5E7EB',
        bdr2: '#D1D5DB',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        pill: '100px',
      },
      fontFamily: {
        sans: ['Sarabun', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
