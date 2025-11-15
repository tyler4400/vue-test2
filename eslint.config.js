// Flat config for ESLint v9+
import tsParser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // ignore patterns
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: (await import('vue-eslint-parser')).default,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      // Vue basics
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      // TS basics
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      // formatting handled by Prettier via ESLint
      'prettier/prettier': 'error',
    },
  },
  // disable rules that might conflict with Prettier
  eslintConfigPrettier,
]
