/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT:'#00f5ff', dark:'#00c8d4' },
        neon:  { purple:'#7b2fff', magenta:'#ff00ff' },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        boldonse: ['Boldonse', 'system-ui'],
        playfair: ['Playfair Display', 'serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        cyan:    '0 0 30px rgba(0,245,255,0.25)',
        'cyan-lg':'0 20px 60px rgba(0,245,255,0.3)',
        glass:   '0 30px 80px rgba(0,0,0,0.5)',
      },
      keyframes: {
        pulseDot: { '0%,100%':{opacity:'1'},'50%':{opacity:'0.3'} },
        bounceSlow:{ '0%,100%':{transform:'translateX(-50%) translateY(0)'},'50%':{transform:'translateX(-50%) translateY(12px)'} },
        floatY:    { '0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-10px)'} },
      },
      animation: {
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'float':       'floatY 6s ease-in-out infinite',
        'float-d':     'floatY 6s ease-in-out -2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};