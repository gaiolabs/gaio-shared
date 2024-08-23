import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { createPowerView, savePowerView, searchMetadata } from '@ModulesCore/commander/commander.core'

const app = new Hono()
    .post('/search', jwtGuard.isAuth, searchMetadata)
    .post('/save-view', jwtGuard.isAuth, savePowerView)
    .post('/create-view', jwtGuard.isAuth, createPowerView)
export default app
