import type { UserType, UserLoginType } from '@gaio/types'
import type { Context } from 'hono'
import { UserModel } from '../../../models'
import { throwError, generateTokens } from '../../../utils'

export const signIn = async (email: string, password: string) => {
    // export const signIn = async (c: Context) => {
    // const body: UserLoginType = await c.req.json()
    // const { email, password } = body

    const userTransformer = (user: UserType) => {
        delete user.password
        const { ...rest } = user
        return rest
    }

    if (!email || !password) {
        return throwError({
            statusCode: 400,
            statusMessage: 'fields missing'
        })
    }

    // check if username exists
    const user = (await UserModel.getUserByEmail(email)) as UserType

    if (!user || !user.password) {
        return throwError({
            error: true,
            message: 'username or password is invalid [1]'
        })
    }

    // check if password is correct
    const doesThePasswordMatch = await Bun.password.verify(password, user.password)

    if (!doesThePasswordMatch) {
        return throwError({
            statusCode: 400,
            statusMessage: 'username or password is invalid [2]'
        })
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateTokens(user)

    // save refresh token to db
    // await createRefreshToken({
    //     token: refreshToken,
    //     userId: user.userId!
    // });

    // save refresh token to cookie and add httpOnly flag
    // sendRefreshToken(event, refreshToken);

    console.log('accessToken', accessToken)
    return {
        token: accessToken,
        refreshToken,
        user: userTransformer(user)
    }
}
