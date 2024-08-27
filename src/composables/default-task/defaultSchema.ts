import type { SchemaType } from '@gaio/shared/types'

export const defaultSchema = {
    select: [],
    insert: [],
    update: [],
    delete: false,
    join: [],
    group: [],
    sort: [],
    filter: [{ operator: '=', list: [], andOr: 'and' }],
    having: [{ operator: '=', list: [], andOr: 'and' }],
    computed: [],
    limit: null,
    offset: null,
    limitBy: []
} as SchemaType
