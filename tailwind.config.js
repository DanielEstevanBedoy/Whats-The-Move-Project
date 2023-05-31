/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans"]
      },
      gridTemplateColumns: {
        "1/5": "1fr 5fr"
      },
      inset: {
        '29.5' : '29.5%',
        '41.3': '41.3%',
        '53': '53%',
        '64.8': '64.8%',

          '76.5' : '76.5&',


        '35.2' : '35.2%',
        '23.5' : '23.5%',
        '11.7' : '11.7%',
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

