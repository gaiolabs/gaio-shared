import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'

import appRoutes from './routes/app.routes'
import authRoutes from './routes/auth.routes'
import builderRoutes from './routes/builder.routes'
import commanderRoutes from './routes/commander.routes'
import discoveryRoutes from './routes/discovery.routes'
import flowRoutes from './routes/flow.routes'
import repoRoutes from './routes/repo.routes'
import tableRoutes from './routes/table.routes'
import taskRoutes from './routes/task.routes'
import userRoutes from './routes/user.routes'
import settingsRoutes from './routes/settings.routes'

export const app = new Hono().basePath('/api')

// * MIDDLEWARE
app.use(cors())
app.use(secureHeaders())
app.use(logger())
app.use(prettyJSON())

// * ROUTING
app.route('/app', appRoutes)
app.route('/auth', authRoutes)
app.route('/repo', repoRoutes)
app.route('/flow', flowRoutes)
app.route('/commander', commanderRoutes)
app.route('/user', userRoutes)
app.route('/discovery', discoveryRoutes)
app.route('/task', taskRoutes)
app.route('/table', tableRoutes)
app.route('/builder', builderRoutes)
app.route('/settings', settingsRoutes)

app.get('/', (c) => {
    c.status(200)
    return c.json({
        errors: false,
        message: 'hello world'
    })
})

// * GLOBAL ERROR HANDLING
app.notFound((c) => {
    c.status(404)
    return c.json({
        errors: true,
        message: 'Endpoint not found'
    })
})

app.onError((err, c) => {
    console.error(`${err}`)
    // c.status = c.status || 500
    err.message = err.message || 'Internal Server Error'
    return c.json({
        errors: true,
        message: err.message
    })
})

// * START SERVER
export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch
}
