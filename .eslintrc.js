module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['node', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'node/no-unsupported-features/es-syntax': 'off',
  },
};
