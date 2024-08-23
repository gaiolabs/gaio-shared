const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
    env: {
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier-vue/recommended',
        'prettier'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    // plugins: ['only-warn'],
    rules: {
        'space-before-function-paren': 'off',
        camelcase: 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        'vue/no-mutating-props': 'off',
        'vue/v-slot-style': 'off',
        'vue/order-in-components': [
            'error',
            {
                order: ['imports', 'variables', 'functions', 'lifecycle', 'render-function']
            }
        ],
        'tailwindcss/no-custom-classname': 'off',
        'prettier-vue/prettier': [
            'error',
            {
                tabWidth: 4,
                semi: false,
                singleQuote: true,
                singleAttributePerLine: true,
                printWidth: 120,
                trailingComma: 'none',
                bracketSameLine: false,
                bracketSpacing: true,
                htmlWhitespaceSensitivity: 'ignore',
                experimentalTernaries: true,
                plugins: ['prettier-plugin-tailwindcss'],
                tailwindConfig: './tailwind.config.js'
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
            files: ['*.js?(x)', '*.ts?(x)']
        }
    ],
    settings: {
        usePrettierrc: false
    }
}
