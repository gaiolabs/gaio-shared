/**@type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    plugins: ['simple-import-sort'],
    rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'prettier-vue/prettier': [
            'error',
            {
                tailwindConfig: './tailwind.config.js'
            }
        ],
        'vue/no-v-html': 'off',
        'vue/order-in-components': [
            'error',
            {
                'order': ['imports', 'variables', 'functions', 'lifecycle', 'render-function']
            }
        ]
    },
    extends: ['@gaio/shared/eslint-config/vue'],
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 'latest'
    }
}
