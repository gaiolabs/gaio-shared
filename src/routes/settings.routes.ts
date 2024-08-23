import { listOfSharedApps, setupSharedApps } from '@ModulesCore/settings/settings.app-share'
import { getSetting } from '@ModulesCore/settings/settings.core'
import {
    changeTagRole,
    deleteGroup,
    grantTag,
    listByTag,
    saveGroup,
    tagManagerList
} from '@ModulesCore/settings/setttings.tag-manager'
import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'

const app = new Hono()
    .get('/tag/manager-list', jwtGuard.isAuth, tagManagerList)
    .post('/tag/list-by-type', jwtGuard.isAuth, listByTag)
    .post('/tag/save-group', jwtGuard.isAuth, saveGroup)
    .post('/tag/delete-group', jwtGuard.isAuth, deleteGroup)
    .post('/tag/change-role', jwtGuard.isAuth, changeTagRole)
    .post('/tag/grant', jwtGuard.isAuth, grantTag)
    .post('/tag/remove', jwtGuard.isAuth, grantTag)

    .get('/app/shared-list', jwtGuard.isAuth, listOfSharedApps)
    .post('/app/setup-share', jwtGuard.isAuth, setupSharedApps)

    .get('/get/:settingId', jwtGuard.isAuth, getSetting)
    .post('/update', jwtGuard.isAuth, setupSharedApps)

export default app
