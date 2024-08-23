import type { RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'

const redisOptions: RedisOptions = {
    port: Number(Bun.env.GAIO_REDIS_PORT), // Redis port
    host: Bun.env.GAIO_REDIS_HOST || 'redis', // Redis host
    username: '', // needs Redis >= 6
    password: '',
    db: 3 // Defaults to 0
}

const redis = new Redis(redisOptions)

export const gaioRedis = {
    set: async <T>(key: string, value: T) => {
        await redis.set(key, JSON.stringify(value))
    },
    get: async <T>(key: string): Promise<T | null> => {
        const data = await redis.get(key)

        if (!data) {
            return null
        }

        return JSON.parse(data) as T
    },
    pub: new Redis(redisOptions),
    sub: () => new Redis(redisOptions)
}
