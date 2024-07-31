const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-orange': 'linear-gradient(90deg, #ff6600, #7a2a05)', // Custom gradient definition
      },
      colors: {
        offwhite: '#f8f8f8',
        // You can adjust the hex code as needed
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%, 100%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      boxShadow: {
        'text': '2px 2px 4px rgba(0, 0, 0, 0.5)',  // Example text shadow
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',  // Example text shadow
        },
        '.text-shadow-md': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-lg': {
          textShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-xl': {
          textShadow: '7px 7px 14px rgba(0, 0, 0, 0.25)',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
  variants: {
    extend: {
      backgroundColor: ['hover'],
      // Add other variants you need here
    },
  },
});
