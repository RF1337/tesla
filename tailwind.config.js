/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      'backgroundImage': {
        'roadster': "url('/assets/tesla-bg.jpg')",
        'cybertruck': "url('/assets/cybertruck.jpg')",
        'modelx': "url('/assets/tesla-model-x.jpg')",
        'wallpaper': "url('/assets/wallpaper.jpg')",
    },
    'screens':{
      '600': '600px',
      '900': '900px',
      '1200': '1200px',
    },
  },
  plugins: [],
}
}