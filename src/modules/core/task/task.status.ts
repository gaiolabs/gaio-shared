import type { Context } from 'hono'
import { stream } from 'hono/streaming'
import { gaioRedis } from '../../../db/gaioRedis'

export const taskStatus = async (c: Context) => {
    const { userId } = c.get('user')
    const { appId } = await c.req.json()
    // const request = c.req

    return stream(c, async (stream) => {
        const subscribeId = `${appId}-${userId}`
        const watchFlow = gaioRedis.sub()
        await watchFlow.subscribe(subscribeId)

        await stream.write('{}')

        watchFlow.on('message', (channel, message) => {
            console.log(channel, 'as', subscribeId)
            if (channel && channel === subscribeId) {
                stream.write(message)
            }
        })

        // request.on('stop', () => {
        //     console.log('fasfd')
        // })
        //
        // request.on('close', () => {
        //     console.log('close')
        //     watchFlow.unsubscribe(subscribeId)
        //     watchFlow.quit()
        //     stream.close()
        // })
    })
}
