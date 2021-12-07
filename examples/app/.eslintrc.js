module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  settings: {
    'html/html-extensions': ['.wxml'],
    'css/css-extensions': ['.wxss'],
  },
  // add your custom rules here
  rules: {
    'prettier/prettier': 'error',
  },
  globals: {
    window: true,
    __DEV__: true,
  },
};
