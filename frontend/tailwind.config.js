/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        espresso:  { DEFAULT: '#1A0A00', 50: '#3D1F00', 100: '#2D1500', 200: '#1A0A00' },
        coffee:    { DEFAULT: '#3B1F0A', light: '#5C3317', dark: '#1C0D03' },
        mocha:     { DEFAULT: '#6B3A2A', light: '#8B5A44', dark: '#4A2419' },
        caramel:   { DEFAULT: '#C68B4E', light: '#DBA96A', dark: '#A06B30' },
        gold:      { DEFAULT: '#D4A853', light: '#EFC97A', dark: '#A0772E' },
        amber:     { DEFAULT: '#E8B86D', light: '#F5D08E', dark: '#C49040' },
        cream:     { DEFAULT: '#F5ECD7', light: '#FAF5EB', dark: '#DDD0B0' },
        ivory:     { DEFAULT: '#FAF7F0', light: '#FFFEF9', dark: '#EDE8DC' },
        burgundy:  { DEFAULT: '#4A0E1A', light: '#6B1525', dark: '#2D0910' },
        olive:     { DEFAULT: '#2D3319', light: '#3D4524', dark: '#1E230F' },
        charcoal:  { DEFAULT: '#1A1A1A', light: '#2A2A2A', dark: '#0D0D0D' },
        // Functional
        'bar-dark':   '#0D0805',
        'bar-mid':    '#1A1008',
        'bar-accent': '#C68B4E',
      },
      fontFamily: {
        display:  ['Playfair Display', 'Georgia', 'serif'],
        heading:  ['Cormorant Garamond', 'serif'],
        body:     ['Inter', 'sans-serif'],
        accent:   ['Dancing Script', 'cursive'],
      },
      backgroundImage: {
        'gradient-luxury':  'linear-gradient(135deg, #0D0805 0%, #1A1008 40%, #2D1500 100%)',
        'gradient-gold':    'linear-gradient(135deg, #C68B4E 0%, #D4A853 50%, #E8B86D 100%)',
        'gradient-mocha':   'linear-gradient(180deg, #1A0A00 0%, #3B1F0A 100%)',
        'gradient-card':    'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'radial-glow':      'radial-gradient(ellipse at center, rgba(198,139,78,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'luxury':     '0 25px 50px -12px rgba(0,0,0,0.8), 0 10px 30px rgba(198,139,78,0.1)',
        'gold':       '0 0 30px rgba(212,168,83,0.3), 0 5px 15px rgba(0,0,0,0.5)',
        'card':       '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow':       '0 0 40px rgba(198,139,78,0.4)',
        'inner-gold': 'inset 0 1px 0 rgba(212,168,83,0.3)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'fade-up':    'fadeUp 0.8s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(198,139,78,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(198,139,78,0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
