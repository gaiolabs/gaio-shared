import { shallowRef, triggerRef } from 'vue'
import type { Ref } from 'vue'

interface Options {
    equals?: boolean
}

type UpdateFunction<T> = (oldValue: T) => T

export default <T>(value: T, options?: Options): [() => T, (v: T | UpdateFunction<T>) => void] => {
    const r: Ref<T> = shallowRef(value)
    const get = (): T => r.value
    const set = (v: T | UpdateFunction<T>): void => {
        r.value = typeof v === 'function' ? (v as UpdateFunction<T>)(r.value) : v
        if (options?.equals === false) triggerRef(r)
    }
    return [get, set]
}
