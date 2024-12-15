module.exports = {
    env: {
      node: true, // Add node to environment
      es2021: true, // Use ES2021 features
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended", // TypeScript linting rules
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    parser: "@typescript-eslint/parser",
    rules: {
      // your custom rules
    },
  };
  