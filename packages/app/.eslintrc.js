module.exports = {
  extends: "airbnb-typescript-prettier",
  env: {
    es6: true,
    browser: true,
    jest: true
  },
  rules: {
      "spaced-comment": ["error", "always", { "markers": ["/"] }],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "import/prefer-default-export": "off",
  },                                                            
  settings: {
      react: {
          version: "detect"
      },
  }
};
