// import { createPowerView } from './commander.core'
// import { guardLevel } from '../../../utils'

// export default (app) => {
//     app.group('/api/commander', (route) => {
//         route
//             .post('/search', ({ body }) => searchMetadata(body), guardLevel('user'))
//             .post('/save-view', ({ body, user }) => savePowerView(body, user), guardLevel('user'))
//             .post('/create-view', ({ body, user }) => createPowerView(body, user), guardLevel('user'))
//         return route
//     })
// }
