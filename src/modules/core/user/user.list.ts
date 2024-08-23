import type { Context } from 'hono'
import { UserModel } from '../../../models'

export const listAllUsers = async (c: Context) => {
    const users = await UserModel.getAllUsersAndGroups()

    return c.json({
        groups: users.filter((user) => user.role === 'group').map((user) => ({ name: user.name, userId: user.userId })),
        users: users
            .filter((user) => user.role !== 'portal' && user.role !== 'group')
            .map((user) => {
                return {
                    role: user.role,
                    tags: user.tags || [],
                    status: user.status,
                    lang: user.lang,
                    name: user.name,
                    options: user.options,
                    email: user.email,
                    userId: user.userId
                }
            })
    })
}
