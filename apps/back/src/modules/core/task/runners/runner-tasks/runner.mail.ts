import { SESClient } from '@aws-sdk/client-ses'
import type { GenericType, MailTaskType, TaskContextType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import * as sgMail from '@sendgrid/mail'
import { sleep } from 'bun'
import { isNumber } from 'lodash-es'
import * as nodemailer from 'nodemailer'
import templateString from '../../../../../utils/templateString'
import { dropTableIfExist, executeQuery } from '../runner.tools'

export default async <T extends MailTaskType>(taskData: T, taskContext: TaskContextType) => {
    await prepareResult(taskData)

    const extraData = {}

    if (taskData.extraData) {
        for (const tableName of taskData.extraData) {
            extraData[tableName] = await executeQuery({
                at: taskData,
                sql: `select * from  ${getBucketNameFromAppId(taskData.appId)}.${tableName} limit 50`
            })
        }
    }

    const testMail = isTestingMail(taskData, taskContext)

    const list = (await executeQuery({
        at: taskData,
        sql: `SELECT * FROM  ${getBucketNameFromAppId(taskData.appId)}.${taskData.tableName} ${
            testMail ? 'LIMIT 1' : ''
        }`
    })) as GenericType[]

    if (list && list.length > 0) {
        const transporter = await setupMailTransporter(taskData)

        for (const data of list) {
            if (taskData.sleep && isNumber(taskData.sleep) && Number(taskData.sleep) > 0) {
                await sleep(Number(taskData.sleep))
            }

            if (!taskData.toColumnName || !data[taskData.toColumnName]) {
                await saveLog('error', taskData, {
                    message: `No email address found in ${taskData.toColumnName} column`,
                    data
                })
            } else {
                if (testMail) {
                    data[taskData.toColumnName] = taskData.testMail
                }
                await sender(taskData, data, extraData, transporter)
            }
        }
    }

    await keepLogVerify(taskData)

    return { message: 'success' }
}

const isTestingMail = (taskData, taskContext: TaskContextType) => {
    let testMail = false
    const { from, userRole } = taskContext

    if (taskData.testMail && taskData.testMail && from === 'studio' && ['admin', 'dev'].includes(userRole)) {
        testMail = true
    }

    return testMail
}

const setupMailTransporter = async (taskData) => {
    switch (taskData.service) {
        case 'SendGrid':
            return serviceSendGrid(taskData)
        case 'AWS':
            return serviceAws(taskData)
        default:
            return serviceSmtp(taskData)
    }
}

// SMTP
const serviceSmtp = (taskData) => {
    if (taskData.office365) {
        return nodemailer.createTransport({
            // service: 'Outlook365',
            host: 'smtp.office365.com',
            port: 587,
            requireTLS: true,
            secure: false,
            auth: {
                user: taskData.username, // generated ethereal user
                pass: taskData.password // generated ethereal password
            },
            tls: {
                ciphers: 'SSLv3'
            }
        })
    } else {
        return nodemailer.createTransport({
            pool: true,
            host: taskData.host,
            port: Number(taskData.port),
            secure: taskData.secure, // true for 465, false for other ports
            auth: {
                user: taskData.user, // generated ethereal user
                pass: taskData.password // generated ethereal password
            }
        })
    }
}

// SENDGRID
const serviceSendGrid = (taskData) => {
    sgMail.setApiKey(taskData.options.apiKey)
    return sgMail
}

const serviceAws = (taskData) => {
    return nodemailer.createTransport({
        SES: new SESClient({
            apiVersion: '2016-11-15',
            region: taskData.options.region,
            credentials: {
                accessKeyId: taskData.options.apiUser,
                secretAccessKey: taskData.options.apiKey
            }
        })
    })
}

const sender = async (taskData, data, extraData, transporter) => {
    const mailData = {
        from: taskData.from, // sender address
        to: data[taskData.toColumnName], // list of receivers
        subject: prepareTextByParams(taskData.subject, data, extraData), // Subject line
        html: prepareTextByParams(taskData.message, data, extraData) // html body
    }

    if (taskData.service === 'SendGrid') {
        transporter.send(mailData).then(
            () => {},
            (error) => {
                console.error(error)
                if (error.response) {
                    console.error(error.response.body)
                }
            }
        )
    } else {
        return await transporter.sendMail(mailData, async (err, info) => {
            if (err) {
                await saveLog('error', taskData, err)
            } else {
                await saveLog('success', taskData, info)
            }
        })
    }
}

const saveLog = async (status, taskData, result) => {
    await executeQuery({
        at: taskData,
        sql: `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} (message, status) 
            values ('${JSON.stringify(result)}','${status}')`
    })
}

const prepareResult = async (taskData) => {
    if (taskData.resultTable && taskData.resultTable !== '') {
        if (taskData.resultTableTruncate) {
            // DROP BEFORE
            await dropTableIfExist(taskData)
        }
        await executeQuery({
            at: taskData,
            sql: `
      CREATE TABLE IF NOT EXISTS ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} (
          created_at DateTime DEFAULT now(),
          message Nullable(String),
          status Nullable(String)
      )  ENGINE = MergeTree ORDER BY tuple()`
        })
    }
    return { message: 'Table result created' }
}

const keepLogVerify = async (taskData) => {
    if (taskData.resultTable && Number(taskData.keepLogDays || 0) > 0) {
        await executeQuery({
            at: taskData,
            sql: `ALTER TABLE ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} 
                        DELETE WHERE created_at < subtractDays(now(), ${Number(taskData.keepLogDays) || 2})`
        })
    }
    return { message: 'Deleted' }
}

const prepareTextByParams = (text, item, extraData) => {
    const params = []
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            params.push({
                paramName: key,
                paramValue: item[key]
            })
        }
    }
    return templateString(text, params, extraData)
}
