import { Hono } from 'hono'
import type { Context } from 'hono'
import jwtGaurd from '../middleware/jwt.guard'
import { listAllUsers } from '@ModulesCore/user/user.list'
import { bulkSaveUser, deleteUser, saveUser } from '@ModulesCore/user/user.manager'
import { userPrepare } from '@ModulesCore/user/user.prepare'
import { resetTwoFactor } from '@ModulesCore/user/user.two-factor'
import { isUniqEmail, updatePassword, updateUserMetadata, updateUserOptions } from '@ModulesCore/user/user.update'

const app = new Hono()
    .post('/prepare', jwtGaurd.isAuth, userPrepare)
    .post('/update-metadata', jwtGaurd.isAuth, updateUserMetadata)
    .post('/check-email', jwtGaurd.isAuth, async (c: Context) => c.json(isUniqEmail((await c.req.json()).email)))
    .post('/update-password', jwtGaurd.isAuth, updatePassword)
    .post('/update-options', jwtGaurd.isAuth, updateUserOptions)

    // to-do
    // admin routes
    .get('/list', jwtGaurd.isAuth, listAllUsers)
    .post('/save-user', jwtGaurd.isAuth, saveUser)
    .post('/bulk-save-user', jwtGaurd.isAuth, bulkSaveUser)
    .post('/reset-two-factor', jwtGaurd.isAuth, resetTwoFactor)
    .post('/delete-user', jwtGaurd.isAuth, deleteUser)

export default app
