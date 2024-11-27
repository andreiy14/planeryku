import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */


export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      // Basic rules
      'no-unused-vars': 'warn', // Warn if there are unused variables
      'no-console': 'off', // Allow the use of console.log
      'no-debugger': 'error', // Disallow debugger in production

      // React-specific rules
      'react/prop-types': 'off', // Disable prop-types if using TypeScript
      'react/no-unescaped-entities': 'warn', // Warn about unescaped characters in JSX

      // Code style rules
      quotes: ['error', 'single'], // Enforce single quotes
      semi: ['error', 'always'], // Require semicolons
      indent: ['error', 2], // Enforce 2 spaces for indentation
      'comma-dangle': ['error', 'always-multiline'], // Require trailing commas for multiline objects/arrays
      'arrow-spacing': ['error', { before: true, after: true }], // Enforce spacing around arrow functions

      // Best practices
      eqeqeq: ['warn', 'always'], // Require === instead of ==
      curly: ['error', 'all'], // Require curly braces for all control statements
      'no-duplicate-imports': 'error', // Disallow duplicate imports
      'prefer-const': 'warn', // Warn if const can be used instead of let
      // 'prettier/prettier': 'error',
    },
  },
  // { extends: [
  //   'eslint:recommended',
  //   'plugin:react/recommended',
  //   'plugin:prettier/recommended', // Enables Prettier
  // ]},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];