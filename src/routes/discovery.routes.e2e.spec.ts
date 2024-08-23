import type { UserType } from '@gaio/types'
import { describe, expect, test } from 'bun:test'
import type { Hono } from 'hono'
import { app } from '../main'

async function _e2e_authenticateUser(app: Hono) {
    type AuthenticateUserResponse = {
        token: string
        refreshToken: string
        user: Omit<UserType, 'password'>
    }

    const user = {}

    const response = await app.request('/sign-in', {
        method: 'POST',
        body: JSON.stringify(user)
    })
    // const response = await testClient(app).request('/sign-in', {
    //     method: 'POST',
    //     body: JSON.stringify(user)
    // })

    return (await response.json()) as AuthenticateUserResponse
}

describe('Discovery Routes - /discovery', () => {
    test.todo('POST /discovery/list', async () => {
        const { token } = await _e2e_authenticateUser(app)

        const body = {
            appId: '123456789'
        }

        const res = await app.request('/discovery/list', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({ 'Content-Type': 'application/json', Authorization: token })
        })

        expect(res.status).toBe(200)
    })

    test.todo('POST /discovery/save-meta', async () => {
        const body = {}
        const res = await app.request('/discovery/save-meta', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        expect(res.status).toBe(200)
    })

    test.todo('POST /discovery/update-hits', async () => {
        const body = {}
        const res = await app.request('/discovery/update-hits', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        expect(res.status).toBe(200)
    })

    test('GET /discovery/list-power', async () => {
        const { token } = await _e2e_authenticateUser(app)

        const res = await app.request('/discovery/list-power', {
            headers: new Headers({ Authorization: token })
        })

        expect(res.status).toBe(200)
    })
})
