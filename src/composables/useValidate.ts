import type { GenericType } from '@gaio/types'
import Validator from 'fastest-validator'

// rule docs: https://github.com/icebob/fastest-validator

export default () => {
    const v = new Validator()
    const isValid = <T extends GenericType>(data: T, rules: GenericType) => {
        const check = v.compile(rules)
        return check(data) === true
    }

    return { isValid }
}
