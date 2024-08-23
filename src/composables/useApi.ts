import { ofetch } from 'ofetch'

import { useAuthStore } from '@/stores'

type optionType = { body?: Record<string, unknown>; headers?: Record<string, unknown>; [prop: string]: unknown }

export default (refId?: string) => {
    const { token } = useAuthStore()
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const baseUrl = import.meta.env.VITE_APP_API

    return {
        baseUrl,
        post: async (url: string, options?: optionType) =>
            ofetch(baseUrl + url, {
                ...options,
                method: 'POST',
                body: options?.body ? JSON.stringify(options.body) : undefined,
                headers: {
                    ...(options?.headers ? options.headers : {}),
                    authorization: `Bearer ${token}`,
                    pragma: 'no-cache',
                    'Cache-Control': 'no-cache',
                    'g-ref': refId || 'none'
                }
            }).catch((error) => {
                console.error('error', error.message)
                throw error
            }),
        get: (url: string, options?: optionType) =>
            ofetch(baseUrl + url, {
                ...options,
                headers: {
                    ...(options?.headers ? options.headers : {}),
                    authorization: `Bearer ${token}`,
                    pragma: 'no-cache',
                    'Cache-Control': 'no-cache',
                    'g-ref': refId || 'none'
                }
            })
    }
}
