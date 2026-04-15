import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/App.tsx', 'src/main.tsx'],
    extends: [reactRefresh.configs.vite],
  },
  {
    files: ['src/stories/**/*.stories.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: [
      'src/components/ui/data-table.tsx',
      'src/components/ui/editable-data-table.tsx',
      'src/components/ui/url-data-table.tsx',
      'src/components/ui/virtual-data-table.tsx',
    ],
    rules: {
      'react-hooks/incompatible-library': 'off',
    },
  },
])
