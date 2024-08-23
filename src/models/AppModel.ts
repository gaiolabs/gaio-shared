import type { AppType, ParamType, UserType, FormType } from '@gaio/types'
import { uniqBy } from 'lodash-es'
import { SerialModel } from './index'
import { dbGaio } from '../db/db.gaio'

const validateAppId = (appId: string) => {
    return /^app:\d+$/.test(appId)
}

const getAllApps = async (user: UserType) => {
    return await dbGaio().query(
        `SELECT app.appId AS appId, 
            app.appToken AS appToken,
            app.repoId AS repoId,
            app.appName AS appName,
            app.appDescription AS appDescription,
            app.options AS options,
            app.updatedAt as updatedAt,
            tag.role as role
        FROM app
        INNER JOIN tag ON tag.refId = app.appId
        WHERE tag.userId = {userId: String}
        ORDER BY app.updatedAt DESC`,
        {
            parse: ['options'],
            params: {
                userId: user.userId
            }
        }
    )
}

const getAppsInTagByType = async (appId: string) => {
    return await dbGaio('getAppsInTagByType').query(
        `SELECT DISTINCT(ap.appId), ap.appId AS refId, ap.appName AS name, 'app' AS type
                            from app ap
                            left join tag ta on ta.refId = ap.appId and ta.type = 'app'
                            where ap.appId = {appId: String}`,
        {
            params: {
                appId
            }
        }
    )
}

const getAppsToTagControl = async (userId?: string) => {
    if (userId) {
        return await dbGaio('getAppsToTagControl').query(
            `SELECT DISTINCT(ap.appId), 
                    ta.userId, 
                    ta.role, 
                    ap.appId AS refId, 
                    ap.appName AS name, 
                    'app' AS type
              FROM app ap
              LEFT JOIN tag ta ON ta.refId = ap.appId AND ta.type = 'app'
              WHERE ta.userId = {userId: String}`,
            {
                params: {
                    userId
                }
            }
        )
    }
    return await dbGaio('getAppsToTagControl').query(
        `SELECT appId, appId AS refId, appName AS name, 'app' AS type FROM app`
    )
}

const getAppsByIds = async (listOfIds: string[], user: UserType) => {
    return await dbGaio('getAppsByIds').query(
        `SELECT app.appId AS appId, 
            app.appToken AS appToken,
            app.repoId AS repoId,
            app.appName AS appName,
            app.appDescription AS appDescription,
            app.options AS options,
            app.updatedAt as updatedAt,
            tag.role as role
        FROM app
        INNER JOIN tag ON tag.refId = app.appId
        WHERE tag.userId = {userId: String} 
        AND appId in ({ids: Array(String)})
        ORDER BY updatedAt DESC`,
        {
            parse: ['options'],
            params: {
                userId: user.userId,
                ids: listOfIds
            }
        }
    )
}

const getSingleAppById = async (appId: string) => {
    if (validateAppId(appId)) {
        return await dbGaio()
            .query(
                `SELECT * FROM app 
                    WHERE appId = {appId: String} `,
                {
                    parse: ['options', 'params', 'forms'],
                    params: {
                        appId
                    }
                }
            )
            .then((res) => res[0])
    }
    throw new Error('Invalid appId')
}

const createApp = async (app: Partial<AppType>) => {
    const serialNumber = await SerialModel.getAppSerial()

    app.appId = 'app:' + serialNumber

    await dbGaio().insert('app', [
        {
            ...app,
            options: JSON.stringify(app.options)
        }
    ])

    return app
}

const mergeApp = async (app: Partial<AppType>, user: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE app 
                UPDATE appName = {appName: String},
                        appDescription = {appDescription: String},
                        options = {options: String},
                        modifiedBy = {modifiedBy: String}
                        WHERE appId = {appId: String}`,
        {
            params: {
                appName: app.appName,
                appDescription: app.appDescription,
                options: app.options,
                modifiedBy: user.userId,
                appId: app.appId
            },
            stringify: ['options']
        }
    )
}

const deleteApp = async (appId: string) => {
    return await dbGaio().exec(
        `DELETE FROM app
            WHERE appId = {appId: String}`,
        {
            params: {
                appId
            }
        }
    )
}

const mergeAppOptions = async (userId: string, appId: string, options: Record<string, unknown>) => {
    return await dbGaio().exec(
        `ALTER TABLE app
            UPDATE options = {options: String},
                    modifiedBy = {modifiedBy: String}
            WHERE appId = {appId: String}`,
        {
            params: {
                modifiedBy: userId,
                options,
                appId
            },
            stringify: ['options']
        }
    )
}

const updateParams = async (appId: string, userId: string, params: ParamType[]) => {
    params = uniqBy(
        params.filter((param) => param.paramName !== 'userId'),
        'paramName'
    )

    return await dbGaio('updateParams').exec(
        `ALTER TABLE app
            UPDATE params = {params: String},
                    modifiedBy = {modifiedBy: String}
            WHERE appId = {appId: String}`,
        {
            params: {
                modifiedBy: userId,
                params,
                appId
            },
            stringify: ['params']
        }
    )
}

const updateForms = async (appId: string, userId: string, forms: FormType[]) => {
    const saveFormList = uniqBy(forms, 'formId')

    return await dbGaio('updateForms').exec(
        `ALTER TABLE app
            UPDATE forms = {forms: String},
                    modifiedBy = {modifiedBy: String}
            WHERE appId = {appId: String}`,
        {
            params: {
                modifiedBy: userId,
                forms: saveFormList,
                appId
            },
            stringify: ['forms']
        }
    )
}

export const appShared = async () => {
    return await dbGaio('appShared').query(
        `
             SELECT 
                a.appId, 
                a.appName, 
                a.options, 
                a.repoId, 
                p.sees
             FROM app a
             LEFT JOIN pass p ON p.appId = a.appId 
    `,
        {
            parse: ['options']
        }
    )
}

export default {
    getAppsToTagControl,
    getAppsInTagByType,
    getSingleAppById,
    mergeAppOptions,
    getAppsByIds,
    updateParams,
    updateForms,
    getAllApps,
    createApp,
    appShared,
    mergeApp,
    deleteApp
}
