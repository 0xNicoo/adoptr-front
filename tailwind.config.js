const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#051A65',
        'primary-blue': '#1C3EB2',
        'primary-orange': '#FF823B',
        'primary-orange-dark': '#db6826',
        'footer-primary': '#0B2545',
        'sectionB': '#F8F3EA',
        'sectionC': '#D1E8FF',
        'sectionD':'#5784E6',
        'secondary-blue': '#0B1956',
        'blue-hover': '#040A22',
      },
      spacing: {
        '18': '4.5rem', 
        '20': '5rem', 
        '24': '6rem',
        '28': '7rem',  
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '2px 4px 8px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      )
    }),
  ],
};
