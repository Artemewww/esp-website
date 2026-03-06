/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        esp: {
          white: '#FFFFFF',
          black: '#1A1A1A',
          gray: '#EDEDED',
          blue: '#002366',
          green: '#006039',
          lidar: '#00D4FF',
          metal: '#2D3748'
        }
      },
      fontFamily: {
        rounded: ['SF Pro Rounded', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hardware-pattern': 'radial-gradient(circle at 2px 2px, rgba(0,35,102,0.15) 1px, transparent 0)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}