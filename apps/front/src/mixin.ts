import useHelper from '@/composables/useHelper'
import type { GenericType } from '@gaio/types'

export const mixin = {
    methods: {
        $filterBy: <T>(list: T[], by: string, term: string): T[] => useHelper().filterBy(list, by, term),
        $search: (list: GenericType[], term: string, limit = 500) => useHelper().search(list, term, limit),
        $normalize: (value: string) => useHelper().normalize(value),
        $alpha: (name = '') => {
            name = name.replace(/[^a-zA-Z0-9]/g, '_').trim()
            return name
        }
    }
}
