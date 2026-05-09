/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0f',
        card: '#111827',
        border: '#1f2937',
        primary: '#7c3aed',
        accent: '#a855f7',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: {
          primary: '#ffffff',
          muted: '#94a3b8',
          subtle: '#64748b',
        },
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124, 58, 237, 0.25), 0 10px 30px rgba(124, 58, 237, 0.15)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
}