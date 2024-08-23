import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { deleteSource, getSourceDataById, listSources, upsertSource } from '@ModulesCore/source/source.manager'

// todo - add guardLevel admin
const app = new Hono()
    .get('/data/:sourceId', jwtGuard.isAuth, getSourceDataById)
    .get('/list', jwtGuard.isAuth, listSources)
    .post('/remove', jwtGuard.isAuth, deleteSource)
    .post('/save', jwtGuard.isAuth, upsertSource)

export default app
