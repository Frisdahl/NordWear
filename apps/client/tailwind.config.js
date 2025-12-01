module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        nwGreen: "#2BB573",
        nwRed: "#E31710",
        nwBlue: "#34568D",
        nwGray: "#9CA3AF",
        nwLightGray: "#D9D9D9",
        nwDarkGray: "#787878",
      },

      fontFamily: {
        sans: ["Figtree", "sans-serif"],
        serif: ["EB Garamond", "serif"],
      },

      fontSize: {
        fluidTitle: "clamp(1.5rem, 3vw + 1rem, 2.5rem)",
        fluidSmall: "clamp(0.875rem, 0.5vw + 0.5rem, 1.125rem)",
        hero: "clamp(2rem, 3vw + 1rem, 4rem)",
        heading: "clamp(1.4rem, 1vw + 1rem, 2.2rem)",
        body: "clamp(1rem, 0.5vw + 0.8rem, 1.2rem)",
      },
    },
  },
  plugins: [],
};
