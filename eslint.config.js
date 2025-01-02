// eslint.config.js
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist', '.turbo', 'node_modules'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { // Correct placement for parserOptions
      ecmaVersion: 'latest',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-process-exit': 'off',
      'no-useless-catch': 'warn',
    },
  },
  {
    files: ['**/*.ts'],
    parser: '@typescript-eslint/parser',
    parserOptions: { // This is correct for the TS config
      project: './tsconfig.json',
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    files: ['**/*.{js,ts}'],
    ...eslintConfigPrettier,
    rules:{
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
    }
  },
];
