module.exports = {
  parser: "babel-eslint",
  extends: "airbnb",
  plugins: ["import"],
  rules: {
    quotes: [2, "single", { avoidEscape: true }],
    "no-bitwise": [0]
  }
};
