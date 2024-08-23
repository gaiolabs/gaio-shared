import type { UserType } from '@gaio/types'
import type { Context } from 'hono'
import { isUniqEmail } from './user.update'
import { UserModel } from '../../../models'

export const bulkSaveUser = async (c: Context) => {
    const userContext = c.get('user')
    const { users }: { users: UserType[] } = await c.req.json()

    await Promise.all(
        users
            .filter((user) => user.userId)
            .map((user) => {
                return UserModel.updateUserData(
                    {
                        name: user.name,
                        email: user.email,
                        role: user.role || 'user',
                        status: user.status || 'inactive',
                        lang: user.lang || 'en-US',
                        userId: user.userId
                    },
                    userContext
                )
            })
    )
    return c.json({ status: 'done' })
}

export const saveUser = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const { userData }: { userData: UserType } = await c.req.json()

    // userData: UserType, userContext: UserType
    const { name, status, password, tags, email, userId, role, options, lang } = userData

    // list user to be update
    // check if the user is changing the email,
    // if the email already exist in a different user, throw error

    if (userId) {
        const currentUser = await UserModel.getUserById(userId)

        if (currentUser) {
            const checkEmail = await UserModel.emailExist(email)

            if (checkEmail && checkEmail.length > 0) {
                throw new Error('userExists')
            }

            await UserModel.updateUserData(
                {
                    name,
                    email,
                    role,
                    status,
                    lang,
                    userId
                },
                userContext
            )

            if (userId && password && password !== '') {
                await UserModel.updatePassword({
                    password: await Bun.password.hash(password),
                    userId
                })
            }
        }
    } else {
        const checkIfUserAlreadyExist = await isUniqEmail(email)

        if (checkIfUserAlreadyExist && !checkIfUserAlreadyExist.valid) {
            throw new Error('userExists')
        } else {
            await UserModel.createUser({
                name,
                email,
                password: await Bun.password.hash(password),
                role,
                lang,
                tags,
                options
            })
        }
    }

    return c.json({ status: 'done' })
}

export const deleteUser = async (c: Context) => {
    const userContext = c.get('user')
    const { userId } = await c.req.json()
    await UserModel.deleteUser(userId, userContext)
    return c.json({
        status: 'done'
    })
}
