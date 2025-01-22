module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'react/prop-types': 'off', // если не используете PropTypes
    '@typescript-eslint/no-unused-vars': ['error'], // добавьте другие правила по необходимости
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
