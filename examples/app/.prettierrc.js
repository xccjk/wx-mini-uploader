module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  overrides: [
    {
      files: '*.wxss',
      options: {
        parser: 'css',
      },
    },
  ],
};
