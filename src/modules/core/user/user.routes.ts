import { listAllUsers } from './user.list'
import { bulkSaveUser, deleteUser, saveUser } from './user.manager'
import { userPrepare } from './user.prepare'
import { resetTwoFactor } from './user.two-factor'
import { isUniqEmail, updatePassword, updateUserMetadata, updateUserOptions } from './user.update'
import { guardLevel } from '../../../utils'

export default (app) => {
    app.group('/api/user', (route) => {
        // User routes
        route
        // .post('/prepare', async ({ body }) => userPrepare(body), guardLevel('user'))
        // .post(
        //     '/update-metadata',
        //     async ({ body, user }) => updateUserMetadata(user, body.userData),
        //     guardLevel('user')
        // )
        // .post('/check-email', async ({ body }) => isUniqEmail(body.email), guardLevel('user'))
        // .post(
        //     '/update-password',
        //     async ({ body, user }) => updatePassword(user, body.passwordData),
        //     guardLevel('user')
        // )
        // .post(
        //     '/update-options',
        //     async ({ body, user }) => updateUserOptions(user.userId, body.options),
        //     guardLevel('user')
        // )

        // Admin routes
        // route
        //     .get('/list', async () => listAllUsers(), guardLevel('admin'))
        //     .post('/save-user', async ({ body, user }) => saveUser(body.userData, user), guardLevel('admin'))
        //     .post('/bulk-save-user', async ({ body, user }) => bulkSaveUser(body, user), guardLevel('admin'))
        //
        //     .post('/reset-two-factor', async ({ body, user }) => resetTwoFactor(body.userId, user), guardLevel('admin'))
        //     .post('/delete-user', async ({ body, user }) => deleteUser(body.userId, user), guardLevel('admin'))

        return route
    })
}
