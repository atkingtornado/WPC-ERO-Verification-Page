module.exports = {
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 #03457f' },
          '100%': { boxShadow: '0 0 8px 3px transparent', borderWidth: '2px' },
        },
      },
      animation: {
        glow: 'glow 1.8s ease infinite',
      },
    },
  },
}
