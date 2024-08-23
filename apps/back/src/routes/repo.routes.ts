import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { deleteRepo, getListOfRepo, getRepoDataById, upsertRepo } from '@ModulesCore/repo/repo.manager'

const app = new Hono()
    .post('/data/:repoId', jwtGuard.isAuth, getRepoDataById)
    .post('/list', jwtGuard.isAuth, getListOfRepo)
    .post('/save', jwtGuard.isAuth, upsertRepo)
    .post('/delete', jwtGuard.isAuth, deleteRepo)
    .post('/list-details', jwtGuard.isAuth, getListOfRepo)

export default app
