import type { GenericType, WhatsappTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { isObject } from 'lodash-es'
import twilio from 'twilio'
import templateString from '../../../../../utils/templateString'
import { dropTableIfExist, executeQuery } from '../runner.tools'

export default async <T extends WhatsappTaskType>(taskData: T) => {
    await prepareResult(taskData)
    const list = (await listData(taskData)) as GenericType[]

    for (const data of list) {
        await sendData(taskData, data)
    }

    return { status: 'Done' }
}

const listData = async (taskData: WhatsappTaskType) => {
    return await executeQuery({ at: taskData, sql: `select * from ${taskData.tableName}` })
}

const sendData = async (taskData: WhatsappTaskType, data: GenericType) => {
    switch (taskData.sender) {
        case 'twilio':
            return await sendTwilio(taskData, data)
        case 'chat-api':
            return await sendChatApi(taskData, data)
        default:
            return {}
    }
}

const sendChatApi = async (taskData: WhatsappTaskType, data: GenericType) => {
    const { url, phoneTo, message } = taskData.options

    try {
        const response = await fetch(url as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: data[phoneTo as string],
                body: data[message as string]
            })
        })

        const responseData = await response.json()
        return saveResult(taskData, responseData)
    } catch (error) {
        return saveResult(taskData, {
            code: error.code || error.name,
            message: error.message
        })
    }
}

const sendTwilio = async (taskData: WhatsappTaskType, data: GenericType) => {
    const accountSid = taskData.options.twilioAccountSid as string
    const authToken = taskData.options.twilioAuthToken as string

    const template = taskData.templates.find((o: GenericType) => o.template_id === data.template_id)

    if (template && data.phone_to) {
        const client = twilio(accountSid, authToken)
        return await client.messages
            .create({
                body: prepareDataByParameters(template.text, data),
                from: `whatsapp:${taskData.options.phoneFrom}`,
                to: `whatsapp:${data.phone_to}`
            })
            .then((message) => saveResult(taskData, message))
            .catch((err) => saveResult(taskData, err))
    } else {
        return { status: 'Can`t send message' }
    }
}

const saveResult = async (taskData, result) => {
    const saveText = isObject(result) ? JSON.stringify(result) : result
    return await executeQuery({
        at: taskData,
        sql: `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} 
                (message) values ('${saveText}')`
    })
}

const prepareResult = async (taskData) => {
    if (taskData.resultTable && taskData.resultTable !== '') {
        if (taskData.resultTableTruncate) {
            // DROP BEFORE
            await dropTableIfExist(taskData)
        }
        await prepareResultTableAtBucket(taskData)
    }
    return { status: 'success' }
}

const prepareResultTableAtBucket = async (taskData) => {
    // TABLE TO WHERE DATA WILL BE INSERTED
    await executeQuery({
        at: taskData,
        sql: `
        CREATE TABLE IF NOT EXISTS ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} (
            created_at DateTime DEFAULT now(),
            message Nullable(String)
        )  ENGINE = MergeTree ORDER BY tuple()`
    })
}

const prepareDataByParameters = (data, item) => {
    const params = []
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            params.push({
                paramName: key,
                paramValue: item[key]
            })
        }
    }
    return templateString(data, params)
}
