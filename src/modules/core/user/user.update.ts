import type { UserOptionsType } from '@gaio/types'
import type { Context } from 'hono'
import { UserModel } from '../../../models'

export const updateUserOptions = async (c: Context) => {
    const { userId } = c.get('user')
    const { options }: { options: UserOptionsType } = await c.req.json()

    return c.json(UserModel.mergeUserOptions(userId, options))
}

export const updateUserMetadata = async (c: Context) => {
    const contextUser = c.get('user')
    const { userData } = await c.req.json()

    if (userData.userId === contextUser.userId) {
        return c.json(UserModel.mergeUserMetadata(userData))
    }
    throw new Error('User not allowed to update metadata')
}

export const updatePassword = async (c: Context) => {
    const contextUser = c.get('user')
    const { passwordData } = await c.req.json()

    try {
        if (passwordData.newPassword !== passwordData.repeatPassword) {
            return c.json({
                status: 'fail',
                message: 'passwordDoesNotMatch'
            })
        }

        const currentUser = await UserModel.getUserById(contextUser.userId)

        if (currentUser && currentUser.userId) {
            const isMatch = await Bun.password.verify(passwordData.currentPassword as string, currentUser.password)

            if (isMatch) {
                const hashNewPassword = await Bun.password.hash(passwordData.newPassword as string)

                await UserModel.updatePassword({
                    password: hashNewPassword,
                    userId: contextUser.userId
                })

                return c.json({ status: 'ok', message: 'success' })
            }

            return c.json({
                status: 'fail',
                message: 'wrongCurrentPassword'
            })
        }

        return c.json({
            status: 'fail',
            message: 'notAuthorized'
        })
    } catch (e) {
        return c.json({
            status: 'fail',
            message: e.message
        })
    }
}

export const isUniqEmail = async (email: string): Promise<{ valid: boolean }> => {
    const anotherEmail = await UserModel.emailExist(email)

    if (anotherEmail && anotherEmail.length > 0) {
        return {
            valid: false
        }
    }
    return {
        valid: true
    }
}
