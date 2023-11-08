module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'linebreak-style': 'off',
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    camelcase: 'off',
    quotes: 'off',
  },
};
