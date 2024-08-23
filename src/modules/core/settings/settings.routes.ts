// import { listOfSharedApps, setupSharedApps } from './settings.app-share'
// import { getSetting, updateSetting } from './settings.core'
// import {
//     changeTagRole,
//     deleteGroup,
//     grantTag,
//     listByTag,
//     removeTag,
//     saveGroup,
//     tagManagerList
// } from './setttings.tag-manager'
// import { guardLevel } from '../../../utils'

// export default (app) => {
//     app.group('/api/settings', (route) => {
//         tag permissions
//         route
//         .get('/tag/manager-list', () => tagManagerList(), guardLevel('admin'))
//         .post('/tag/list-by-type', ({ body }) => listByTag(body), guardLevel('admin'))
//         .post('/tag/list-by-type', ({ body }) => listByTag(body), guardLevel('admin'))
//         .post('/tag/save-group', ({ body, user }) => saveGroup(body, user), guardLevel('admin'))
//         .post('/tag/delete-group', ({ body }) => deleteGroup(body), guardLevel('admin'))
//         .post('/tag/change-role', ({ body, user }) => changeTagRole(body, user), guardLevel('admin'))
//         .post('/tag/grant', ({ body, user }) => grantTag(body, user), guardLevel('admin'))
//         .post('/tag/remove', ({ body }) => removeTag(body), guardLevel('admin'))

//         app sharing
//         route
//         .get('/app/shared-list', () => listOfSharedApps(), guardLevel('admin'))
//         .post('/app/setup-share', ({ body, user }) => setupSharedApps(body, user), guardLevel('admin'))

//         route
//             .get('/get/:settingId', ({ params }) => getSetting(params.settingId), guardLevel('admin'))
//             .post('/update', ({ body, user }) => updateSetting(body, user), guardLevel('admin'))

//         return route
//     })
// }
