import js from '@eslint/js'
import globals from 'globals'


export default [
	js.configs.recommended,
	{
		rules: {
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-unused-vars': ['warn', { caughtErrors: 'none' }],
			'prefer-const': 'warn'
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.mocha,
				__DEV__: 'readonly',
				PropTypes: 'readonly'
			}
		}
	}
]
