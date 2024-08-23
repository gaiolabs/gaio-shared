import type { Context } from 'hono'
import { ofetch } from 'ofetch'

interface HttpRequestData {
    url: string
    method: string
    headers: HeadersInit
    data?: unknown
}

export const taskRest = async (c: Context) => {
    const { requestData } = await c.req.json()

    const { url, method, headers, data } = requestData as HttpRequestData

    try {
        const { headers: requestHeaders, _data } = await ofetch.raw(url, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : undefined
        })
        return c.json({ headers: requestHeaders, data: _data })

        // Optionally, handle different statuses here or assume all responses are valid
    } catch (error) {
        return c.json({
            error: true,
            message: error.message || 'Unknown error during fetch',
            ...(error.response && { status: error.response.status, statusText: error.response.statusText }),
            ...(error.request && { requestError: true })
        })
    }
}
