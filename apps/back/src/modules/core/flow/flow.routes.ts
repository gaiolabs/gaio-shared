// import { flowClone } from './flow.clone'
// import { flowDelete } from './flow.delete'
// import { flowList } from './flow.list'
// import { flowRenewFlowKey } from './flow.renew-flow-key'
// import { flowSave } from './flow.save'
// import { flowUpdateOrder } from './flow.update-order'
// import { guard } from '../../../utils'

// export default (app) => {
//     app.group('/api/flow', (route) =>
//         route
//             .post('/save', async ({ body, user }) => flowSave(body.flowData, user.userId), {
//                 beforeHandle: guard('dev')
//             })
//             .post('/list', async ({ body }) => flowList(body.appId), {
//                 beforeHandle: guard('dev')
//             })
//             .post('/remove', async ({ body }) => flowDelete(body.flowId, body.appId), {
//                 beforeHandle: guard('dev')
//             })
//             .post('/clone', async ({ body, user }) => flowClone(body.flowId, body.appId, user.userId), {
//                 beforeHandle: guard('dev')
//             })
//             .post('/renew-flow-key', async ({ body, user }) => flowRenewFlowKey(body.flowId, body.appId, user.userId), {
//                 beforeHandle: guard('dev')
//             })
//             .post('/update-order', async ({ body, user }) => flowUpdateOrder(body.appId, body.flowList, user.userId), {
//                 beforeHandle: guard('dev')
//             })
//     )
// }
