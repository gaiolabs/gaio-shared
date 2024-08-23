/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-this-alias': 'off'
    },
    extends: ['@gaio/eslint-config/bun'],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json'
            }
        }
    }
}
