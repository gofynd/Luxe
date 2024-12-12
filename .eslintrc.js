module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb", "airbnb/hooks", "prettier"],
  plugins: ["react", "react-hooks", "jsx-a11y", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "linebreak-style": 0,
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "import/no-unresolved": [
      "error",
      {
        ignore: [
          "^fdk/store$",
          "^fdk-core/components$",
          "^fdk-core/utils$",
          "^fdk-react-templates",
          "react-router-dom",
        ], // Regular expressions
      },
    ],
    "react/prop-types": "off",
    camelcase: "off",
    "no-unused-vars": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/media-has-caption": "off",
    "react/no-array-index-key": "off",
    "react/require-default-props": "off",
    "import/no-extraneous-dependencies": "off",
    "consistent-return": "off",
    "no-useless-escape": "off",
    "react-hooks/exhaustive-deps": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react/jsx-boolean-value": "off",
    "no-param-reassign": "off",
    "react/function-component-definition": "off",
    "no-plusplus": "off",
    "react/self-closing-comp": "off",
    "no-shadow": "off",
    "arrow-body-style": "off",
    "no-use-before-define": "off",
    "global-require": "off",
    "no-restricted-syntax": "off",
    "no-unsafe-optional-chaining": "off",
    "react/no-unknown-property": "off",
  },
};
