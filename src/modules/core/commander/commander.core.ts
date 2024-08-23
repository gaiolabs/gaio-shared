import type { GenericType, MetaViewType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { cloneDeep } from 'lodash-es'
import { commandLoadTables } from './command.core.table'
import { appQuery, metaQuery } from './command.queries'
import { dbGaio } from '../../../db/db.gaio'
import MetaViewModel from '../../../models/MetaViewModel'

const searchBase = {
    app: appQuery,
    meta: metaQuery
}

export const createPowerView = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const { metaViewData }: { metaViewData: MetaViewType } = await c.req.json()
    return c.json(MetaViewModel.createMetaView(metaViewData, userContext))
}

export const savePowerView = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const { metaViewData }: { metaViewData: MetaViewType } = await c.req.json()
    return c.json(MetaViewModel.saveMetaView(metaViewData, userContext))
}

export const searchMetadata = async (c: Context) => {
    const { searchItems, searchTerm, appInfo }: { searchItems: string[]; searchTerm: string; appInfo: GenericType } =
        await c.req.json()
    if (searchItems[0] === 'table') {
        return c.json(commandLoadTables({ searchItems, searchTerm, appInfo }))
    }

    if (['meta', 'app'].includes(searchItems[0])) {
        const queryString: string = searchItems.map((item) => searchBase[item]).join('UNION ALL')

        return c.json(
            dbGaio('metadata')
                .query(`SELECT * FROM (${queryString}) LIMIT 10 SETTINGS use_query_cache = true`, {
                    params: { search: `%${searchTerm}%` },
                    parse: ['options']
                })
                .then((res) => {
                    const dashboard = cloneDeep(res)
                        .filter((item) => item.type === 'app')
                        .map((item) => {
                            item.type = 'dashboard'
                            return item
                        })

                    res = res.concat(dashboard)

                    return res.map((item) => {
                        if (item.type === 'meta') {
                            item.icon = 'powerAll'
                        }

                        if (item.options) {
                            item = {
                                ...item,
                                ...item.options
                            }
                        }

                        if (item.type === 'app') {
                            item.icon = 'flow'
                        }

                        return item
                    })
                })
        )
    }
    return c.json([])
}
