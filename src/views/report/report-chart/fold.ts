import DataSet from '@antv/data-set'

export const fold = (sourceData: Record<string, unknown>[], measures) => {
    const dv = new DataSet.View().source(sourceData)

    // GET ALIAS/TITLE
    const renameList = {}

    const measuresList = Object.assign([], measures)
    measuresList.forEach((obj) => {
        renameList[obj.alias || obj.columnName] = obj.title || obj.alias || obj.columnName
    })

    dv.transform({
        type: 'rename',
        map: renameList
    })

    dv.transform({
        type: 'fold',
        fields: Object.values(renameList),
        key: 'category',
        value: 'measure'
    })

    return dv.rows || []
}

// import { defaults, difference, keys, head, pick, flatMap, map } from 'lodash-es'
//
// export const fold = (data, options = {}) => {
//     const defaultOptions = {
//         fields: [],
//         category: 'category',
//         retains: [],
//         measure: 'measure'
//     }
//
//     // Merge user options with the default ones
//     const { fields, category, retains, measure } = defaults({}, options, defaultOptions)
//
//     // If no fields specified, compute them from the first row in the data
//     const computedFields = fields.length > 0 ? fields : keys(head(data))
//
//     // If no retains specified, compute them as the difference of all keys and the fields
//     const computedRetains = retains.length > 0 ? retains : difference(keys(head(data)), computedFields)
//
//     return flatMap(data, (rowData) => {
//         return map(computedFields, (field) => {
//             const resultRow = pick(rowData, computedRetains)
//             resultRow[category] = field
//             resultRow[measure] = rowData[field]
//             return resultRow
//         })
//     })
// }
