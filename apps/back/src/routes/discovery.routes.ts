import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { listDiscovery, saveMeta, updateHits } from '@ModulesCore/discovery/discovery.core'
import { listPowerReferences } from '@ModulesCore/discovery/discovery.power'

const app = new Hono()
    .post('/list', jwtGuard.isAuth, listDiscovery)
    .post('/save-meta', jwtGuard.isAuth, saveMeta)
    .post('/update-hits', jwtGuard.isAuth, updateHits)
    .get('/list-power', jwtGuard.isAuth, listPowerReferences)

export default app
