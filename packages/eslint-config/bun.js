const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    plugins: ['@typescript-eslint'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/order': [
            'warn',
            {
                groups: ['builtin', 'external'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ]
    },
    ignorePatterns: [
        // Ignore dotfiles
        '.*.js',
        'node_modules/',
        'dist/'
    ],
    overrides: [
        {
            files: ['*.js', '*.ts']
        }
    ],
    settings: {
        usePrettierrc: false,
        'import/resolver': {
            'typescript-bun': {
                project: true,
                alwaysTryTypes: true
            }
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts']
        }
    }
}
