import type { UserType } from '@gaio/types'
import { sign, verify } from 'hono/jwt'

type Token = string
// import { secret } from './config'

// Generate access token
const generateAccessToken = async (user: UserType) => {
    delete user.password
    return await sign(user, 'secret')
}

// Generate refresh token
const generateRefreshToken = async (user: UserType) => {
    delete user.password
    return await sign(user, 'secret')
}

// Generate tokens
export const generateTokens = async (user: UserType) => {
    return {
        accessToken: await generateAccessToken(user),
        refreshToken: await generateRefreshToken(user)
    }
}

// Send access token to cookie
// export const sendRefreshToken = (event: any, token: Token) => {
//     setCookie(event, 'refresh_token', token, {
//         httpOnly: true,
//         sameSite: true
//     });
// };

// Decode refresh token
export const decodeRefreshToken = async (token: Token) => {
    try {
        return verify(token, 'secret')
    } catch (error) {
        return null
    }
}

// Decode access token
export const decodeAccessToken = (token: Token) => {
    try {
        return verify(token, 'secret')
    } catch (error) {
        return null
    }
}
