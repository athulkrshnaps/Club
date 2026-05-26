/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10201d',
        community: {
          emerald: '#0f766e',
          leaf: '#16a34a',
          amber: '#f59e0b',
          sky: '#0284c7',
          rose: '#e11d48'
        }
      },
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.12)',
        glow: '0 18px 55px rgba(15, 118, 110, 0.28)'
      },
      backgroundImage: {
        'community-mesh':
          'radial-gradient(circle at top left, rgba(20, 184, 166, 0.20), transparent 30%), radial-gradient(circle at 80% 10%, rgba(245, 158, 11, 0.18), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.92), rgba(236,253,245,0.84))',
        'dark-mesh':
          'radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 28%), radial-gradient(circle at 85% 12%, rgba(245, 158, 11, 0.16), transparent 26%), linear-gradient(135deg, rgba(15,23,42,1), rgba(19,38,36,1))'
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'float-soft': 'floatSoft 5s ease-in-out infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};
