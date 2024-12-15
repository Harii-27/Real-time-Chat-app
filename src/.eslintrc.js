module.exports = {
    env: {
      browser: true,
      node: true, // Enables Node.js global variables (including 'process')
    },
    globals: {
      process: 'readonly', // Prevents ESLint from throwing errors about `process`
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended', // If you're using React
    ],
    // other configurations...
  };
  