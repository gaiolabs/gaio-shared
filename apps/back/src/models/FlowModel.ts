import type { FlowType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { dbGaio } from '../db/db.gaio'

const getFlowListByAppId = async (appId: string) => {
    return await dbGaio().query(
        `SELECT * 
            FROM flow 
            WHERE appId = {appId: String}
            ORDER BY flowOrder ASC, flowName ASC`,
        {
            params: {
                appId
            },
            parse: ['options', 'cronBase', 'workflow']
        }
    )
}

const getSomeDetailFromFlowByAppId = async (appId: string) => {
    return await dbGaio().query(
        `SELECT 
                    flowName, 
                    flowType,
                    flowId, 
                    flowOrder
        FROM flow 
        WHERE appId = {appId: String}
        ORDER BY flowOrder ASC`,
        {
            params: {
                appId
            }
        }
    )
}

/**
 * @desc save flow based on exclusive props
 * @param flowData
 * @param userId
 */
const mergeFlow = async (flowData: FlowType, userId: string) => {
    const { flowId, appId } = flowData
    const propsThatCanBeUpdates = [
        'flowName',
        'flowDescription',
        'options',
        'cron',
        'cronStatus',
        'cronBase',
        'flowStart',
        'flowType',
        'flowKey',
        'locked',
        'workflow'
    ]

    const objectToSave: Partial<FlowType> = {
        modifiedBy: userId
    }

    propsThatCanBeUpdates.forEach((prop) => {
        if (flowData[prop]) {
            objectToSave[prop] = flowData[prop]
        } else {
            objectToSave[prop] = undefined
        }
    })

    if (objectToSave.cronBase) {
        objectToSave.cron = objectToSave.cronBase.current || null
        objectToSave.cronStatus = objectToSave.cronBase.status || 'inactive'
    } else {
        objectToSave.cron = null
        objectToSave.cronStatus = 'inactive'
        objectToSave.cronBase = {}
    }

    objectToSave.modifiedBy = userId
    objectToSave.locked = !!objectToSave.locked

    return await dbGaio().exec(
        `ALTER TABLE flow
                UPDATE flowName = {flowName: String},
                    flowDescription = {flowDescription: String},
                    options = {options: String},
                    cron = {cron: String},
                    cronStatus = {cronStatus: String},
                    flowType = {flowType: String},
                    flowKey = {flowKey: String},
                    locked = {locked: Boolean},
                    workflow = {workflow: String},
                    modifiedBy = {modifiedBy: String}
                WHERE flowId = {flowId: String} AND appId = {appId: String}`,
        {
            params: {
                flowId,
                appId,
                ...objectToSave
            },
            stringify: ['options', 'cronBase', 'workflow']
        }
    )
}

const saveJustWorkflow = async (flowData: FlowType, userId: string) => {
    return await dbGaio().exec(
        `ALTER TABLE flow
                UPDATE 
                    workflow = {workflow: String},
                    modifiedBy = {userId: String}
                WHERE flowId = {flowId: String} AND appId = {appId: String}`,
        {
            params: {
                ...flowData,
                userId
            },
            stringify: ['workflow']
        }
    )
}

const createFlow = async (flowData: Partial<FlowType>, userId: string) => {
    flowData.flowId = flowData.flowId || getId()
    await dbGaio().insert('flow', [
        {
            flowId: flowData.flowId || getId(),
            appId: flowData.appId,
            flowName: flowData.flowName,
            flowDescription: flowData.flowDescription,
            locked: !!flowData.locked,
            flowType: flowData.flowType || 'flow',
            flowKey: flowData.appId + ':' + getId(32),
            cronStatus: flowData.cronStatus || 'inactive',
            options: JSON.stringify(flowData.options || {}),
            cronBase: JSON.stringify(flowData.cronBase || {}),
            workflow: JSON.stringify({
                nodes: [],
                edges: []
            }),
            modifiedBy: userId,
            createdBy: userId
        }
    ])

    return flowData
}

const deleteFlowByAppId = async (appId: string) => {
    return await dbGaio().exec(`DELETE FROM flow WHERE appId = {appId: String}`, {
        params: {
            appId
        }
    })
}

const renewFlowKey = async (flowId: string, appId: string, userId: string) => {
    const flowKey = appId + ':' + getId(32)
    await dbGaio().exec(
        `ALTER TABLE flow
                UPDATE flowKey = {flowKey: String},
                    modifiedBy = {modifiedBy: String},
                    updatedAt = {updatedAt: Date}    
                WHERE flowId = {flowId: String} AND appId = {appId: String}`,
        {
            params: {
                flowKey,
                flowId,
                appId,
                modifiedBy: userId,
                updatedAt: new Date()
            }
        }
    )
    return {
        flowKey,
        flowId,
        appId
    }
}

const removeFlow = async (flowId: string, appId: string) => {
    return await dbGaio().exec(`DELETE FROM flow WHERE flowId = {flowId: String} AND appId = {appId: String}`, {
        params: {
            flowId,
            appId
        }
    })
}

const updateFlowOrder = async (flowOrder: number, flowId: string, appId: string, userId: string) => {
    return await dbGaio().exec(
        `ALTER TABLE flow
            UPDATE flowOrder = {flowOrder: Number},
                    modifiedBy = {modifiedBy: String}
            WHERE flowId = {flowId: String} AND appId = {appId: String}`,
        {
            params: {
                flowOrder,
                flowId,
                appId,
                modifiedBy: userId
            }
        }
    )
}

const getFlow = async (flowId: string, appId: string) => {
    return await dbGaio().query<FlowType>(
        `SELECT * FROM flow WHERE flowId = {flowId: String} AND appId = {appId: String}`,
        {
            params: {
                flowId,
                appId
            }
        }
    )
}

export default {
    saveJustWorkflow,
    getFlow,
    removeFlow,
    getFlowListByAppId,
    createFlow,
    getSomeDetailFromFlowByAppId,
    updateFlowOrder,
    mergeFlow,
    renewFlowKey,
    deleteFlowByAppId
}
