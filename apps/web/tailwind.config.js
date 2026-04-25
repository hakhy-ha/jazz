module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#171717',
        surfaceHover: '#262626',
        accent: '#25D366', // WhatsApp green
        tiktokPink: '#fe2c55',
        tiktokCyan: '#25f4ee',
        whatsappDark: '#0b141a',
        whatsappSurface: '#111b21',
        whatsappBubble: '#005c4b',
        whatsappBubbleReceived: '#202c33',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      }
    }
  },
  plugins: []
};

