const eslintPluginTypeScript = require('@typescript-eslint/eslint-plugin');
const parserTypeScript = require('@typescript-eslint/parser');
const eslintPluginSecurity = require('eslint-plugin-security');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTypeScript, // ← pass the imported parser object!
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
      security: eslintPluginSecurity,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'security/detect-object-injection': 'warn',
    },
  },
];
