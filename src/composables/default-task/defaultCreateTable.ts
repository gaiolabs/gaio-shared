import { getId } from '@gaio/shared/utils'

// const columns = [
//     {
//         columnName: 'col_1',
//         dataType: 'Nullable(String)',
//         isFunction: false,
//         default: ''
//     },
//     {
//         columnName: 'col_2',
//         dataType: 'Nullable(Int64)',
//         isFunction: false,
//         default: ''
//     },
//     {
//         columnName: 'col_3',
//         dataType: 'Nullable(Date)',
//         isFunction: true,
//         default: 'today()'
//     },
//     {
//         columnName: 'col_4',
//         dataType: 'Nullable(DateTime)',
//         isFunction: true,
//         default: 'now()'
//     },
//     {
//         columnName: 'col_5',
//         dataType: 'Nullable(Float64)',
//         isFunction: false,
//         default: '',
//         columnLength: 2
//     },
//     {
//         columnName: 'col_6',
//         dataType: 'Nullable(Array)',
//         isFunction: false,
//         default: ''
//     }
// ]

import type { CreateTableTaskType } from '@gaio/shared/types'

export const defaultCreateTable = (base: CreateTableTaskType) => {
    return {
        id: base.id || null,
        type: 'create',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        sourceType: 'bucket',

        tableName: base.tableName || '',
        resultTable: base.resultTable || '',
        databaseName: base.databaseName || '',
        resultDatabase: base.databaseName || '',

        columns: (base.columns || []).map((col) => {
            col.id = col.id || getId()
            return col
        }),
        dropTable: base.dropTable || 0
    }
}
