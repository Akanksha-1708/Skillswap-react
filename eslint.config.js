import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist','venv','ai-backend/venv']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Files that intentionally export something besides a component
    // (shadcn's buttonVariants, the useAuth hook next to AuthProvider).
    // This rule only affects hot-reload during development, not app behaviour.
    files: ['src/components/ui/**', 'src/context/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
