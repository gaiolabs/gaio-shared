// import { tableHistogram } from './table-histogram'
// import { tableCount } from './table.count'
// import { tableDescribe } from './table.describe'
// import { tableDistinct } from './table.distinct'
// import { tableEmpty } from './table.empty'
// import { tableFields } from './table.fields'
// import { tableFrequency } from './table.frequency'
// import { tableList } from './table.list'
// import { tableMinMax } from './table.min.max'
// import { tableReport } from './table.report'
// import { tableRows } from './table.rows'
// import { tableStats } from './table.stats'

// export default (app) => {
//     app.group('/api/table', (route) =>
//         route
//             .post('/field', async ({ body }) => {
//                 return await tableFields(body)
//             })
//             .post('/describe', async ({ body }) => await tableDescribe(body))
//             .post('/frequency', async ({ body }) => await tableFrequency(body))
//             .post('/rows', async ({ body }) => await tableRows(body))
//             .post('/list', async ({ body }) => await tableList(body))
//             .post('/count', async ({ body }) => await tableCount(body))
//             .post('/stats', async ({ body }) => await tableStats(body))
//             .post('/empty', async ({ body }) => await tableEmpty(body))
//             .post('/count-distinct', async ({ body }) => await tableDistinct(body))
//             .post('/min-max', async ({ body }) => await tableMinMax(body))
//             .post('/histogram', async ({ body }) => await tableHistogram(body))
//             .post('/report', async ({ body }) => await tableReport(body))
//     )
// }
