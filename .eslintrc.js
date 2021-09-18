module.exports = {
  settings: {
    'import/resolver': {
      'require-aliases/eslint': {
        src: 'tsconfig.json',
        from: 'compilerOptions.paths',
        baseSrc: 'compilerOptions.baseUrl',
      },
      node: {},
    },
  },
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['prettier', 'airbnb-base', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  plugins: ['prettier'],
  parserOptions: { ecmaVersion: 12 },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
    'prettier/prettier': 'error',
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'comma-dangle': ['warn', 'only-multiline'], // only-multiline olmazsa always-multilne dene
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    // 'nonblock-statement-body-position': ['error', 'below'],
    curly: ['error', 'all'],
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'consistent-return': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'import/no-dynamic-require': 'off',
    'newline-per-chained-call': 'off',
    'func-names': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 120 }],
    'no-restricted-syntax': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
};
