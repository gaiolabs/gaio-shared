import { join } from 'path'
import type { BuilderTaskType, CommonTaskType, GenericType, TaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { writeToPath } from 'fast-csv'
import { ensureDirSync, removeSync } from 'fs-extra'
import { shell } from './runner.shell'
import { repositoryInstance } from '../../../../db/db.clickhouse'
import { dbGaio } from '../../../../db/db.gaio'
import { DbService } from '../../../../db/db.service'
import { arrowDataType } from '../../../../utils'

type ColumnGenericType = {
    fields: string
    fieldTypes: string
    createOrderBy: string
    primaryKey: string
}

// export type DetailedTaskType = Partial<{
//     withTotals: boolean
//     insertMode: boolean
//     schema: SchemaType
//     columns: FieldType[]
//     sourceImportTask: string
//     schemaInference: string
//     newOracle: string
//     truncateTables: string[]
//     dropTables: string[]
// }> &
//     Partial<BuilderTaskType>

export const bucketConnection = async <T extends TaskType>(taskData: T) => await new DbService().connect(taskData)

export const dropTableIfExist = async <T extends TaskType>(taskData: T) => {
    const bucketName = getBucketNameFromAppId(taskData.appId as string)
    await executeQuery({
        at: taskData,
        sql: `DROP TABLE 
                IF EXISTS ${bucketName}.${taskData.resultTable}; SETTINGS max_table_size_to_drop = 0`
    })
    return await executeQuery({
        at: taskData,
        sql: `DROP TEMPORARY 
                    TABLE IF EXISTS ${bucketName}.${taskData.resultTable} SETTINGS max_table_size_to_drop = 0`
    })
}

export const createTableAtBucket = async (taskData: TaskType, columns: Partial<ColumnGenericType>) => {
    const bucketName = getBucketNameFromAppId(taskData.appId as string)
    const db = await bucketConnection(taskData)
    const { fieldTypes, createOrderBy, primaryKey } = columns

    let order = ''

    if (primaryKey) {
        order += ` PRIMARY KEY (${primaryKey}) `
    }

    if (createOrderBy) {
        order += ` ORDER BY (${createOrderBy}) `
    } else {
        order += 'ORDER BY tuple()'
    }

    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS ${bucketName}.${taskData.resultTable}
                           (${fieldTypes})
                              ENGINE = MergeTree
                              ${order}
                              SETTINGS allow_nullable_key = 1`
        )
    } catch (e) {
        throw e
    }

    return { status: 'done' }
}

export const resourceFolder = () => {
    return join(__dirname, '..', '..', '..', '..', 'resources')
}

export const createCsvFileFromAnArray = async (data: Array<GenericType>, outputFile: string) => {
    return new Promise((resolve, reject) => {
        writeToPath(outputFile, data, { headers: true })
            .on('finish', () => {
                resolve({ status: 'CSV has been written' })
            })
            .on('error', (err) => reject(err))
    })
}

export const makeSureFolderExist = (path: string) => {
    return ensureDirSync(path)
}

export const contentFolder = () => {
    return join(__dirname, '..', '..', '..', '..', 'content')
}

export const removeLocal = async (files: string[]) => {
    const status = { status: 'done', qtd: 0 }
    for (const file of files) {
        try {
            removeSync(file)
            status.qtd++
        } catch (e) {
            status.qtd--
        }
    }
    return status
}

export const tableCanBeTemporary = (from: string) => {
    return from !== 'studio' && from !== 'cron' && from !== 'rest' && from !== 'api'
}

export const cleanErrorAtCatch = (error) => {
    if (error && error.data && error.data[0]) {
        const { message, code } = error.data[0]
        throw { error: true, message, code }
    } else if (error && error.data && error.data.message) {
        const { message, code } = error.data
        throw { error: true, message, code }
    } else {
        const { message, code, errno, query } = error
        throw { error: true, message, code, errno, query }
    }
}

export const changeEncoding = async (fileLocation: string) => {
    return await shell('transform encoding', `vim +"set nobomb | set fenc=utf8 | x" ${fileLocation}`, [])
}

// export const createTableViewAtBucket = async (taskData: TaskType, columns: GenericType, query: string) => {
//     const bucketName = getBucketNameFromAppId(taskData.appId as string)
//     const db = await bucketConnection(taskData)
//     const { fieldTypes } = columns
//
//     try {
//         db.query(
//             ` CREATE VIEW IF NOT EXISTS ${bucketName}.${taskData.resultTable}
//                         (${fieldTypes})
//                         AS ${query}`
//         )
//     } catch (e) {
//         throw e
//     }
//
//     return { status: 'done' }
// }

export const createTableAsSelectAtBucket = async (taskData: TaskType, columns: GenericType, query: string) => {
    const bucketName = getBucketNameFromAppId(taskData.appId as string)
    const db = await bucketConnection(taskData)
    const { fieldTypes, createOrderBy, primaryKey } = columns

    let order = ''

    if (primaryKey) {
        order += ` PRIMARY KEY (${primaryKey}) `
    }

    if (createOrderBy) {
        order += ` ORDER BY (${createOrderBy}) `
    } else {
        order += 'ORDER BY tuple()'
    }

    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS ${bucketName}.${taskData.resultTable}
                    (${fieldTypes})
                        ENGINE = MergeTree
                    ${order} SETTINGS allow_nullable_key = 1 AS
                    (${query})`
        )
    } catch (e) {
        throw e
    }

    return { status: 'done' }
}

export const insertAsSelect = async (taskData: TaskType, fieldStringList: string, query: string) => {
    const bucketName = getBucketNameFromAppId(taskData.appId as string)
    const db = await bucketConnection(taskData)
    return await db.query(
        `INSERT INTO ${bucketName}.${taskData.resultTable}
           (${fieldStringList})
           ${query}`
    )
}

export const generateClickhouseColumnTypes = <T extends BuilderTaskType>(taskData: T) => {
    const fields = []
    const types = []
    const createOrderBy = []
    const primaryKey = []

    const columns = taskData.schema ? taskData.schema.select : taskData.columns

    for (const field of columns) {
        arrowDataType(field)

        let columnName = field.alias || field.columnName

        if (!taskData.schemaInference) {
            if (taskData.client === 'oracle') {
                columnName = columnName.toLowerCase()
            }
        }

        let defaults =
            field.default ?
                field.isFunction ?
                    `default ${field.default}`
                :   `default '${field.default}'`
            :   ''

        let comment = field.columnLength ? ` COMMENT 'columnLength=${field.columnLength}'` : ''

        if (field.dataType.includes('Array')) {
            if (field.arrayDataType === 'Numeric') {
                field.dataType = `Array(Nullable(Float64))`
            } else {
                field.dataType = `Array(Nullable(String))`
            }
            defaults = ''
            comment = ''
        }

        fields.push(`${columnName}`)
        types.push(`${columnName} ${field.dataType} ${defaults} ${comment}`)

        if (field.createOrderBy) {
            createOrderBy.push(columnName)
        }

        if (field.primaryKey) {
            primaryKey.push(columnName)
        }
    }

    return {
        fields: fields.toString(),
        fieldTypes: types.toString(),
        createOrderBy: createOrderBy.toString(),
        primaryKey: primaryKey.toString()
    } as ColumnGenericType
}

type SchemaInferenceType = { fileFormatType: string; schemaInference: string } & TaskType

export const prepareSchemaInference = <T extends Partial<SchemaInferenceType>>(taskData: T) => {
    let schemaInference: string
    let inferType: string

    switch (taskData.fileFormatType) {
        case 'TabSeparatedWithNames':
            inferType = 'input_format_tsv_use_best_effort_in_schema_inference'
            break
        case 'CSVWithNames':
            inferType = 'input_format_csv_use_best_effort_in_schema_inference'
            break
        default:
            inferType = 'input_format_csv_use_best_effort_in_schema_inference'
            break
    }

    if (taskData.schemaInference === 'schemaInference') {
        schemaInference = inferType + '=1'
    } else {
        schemaInference = inferType + '=0'
    }

    return schemaInference
}

export const dropOrTruncateUsedSource = async <T extends CommonTaskType>(taskData: T) => {
    if (taskData.truncateTables) {
        const bucketName = getBucketNameFromAppId(taskData.appId as string)
        const db = await bucketConnection(taskData)
        for (const table of taskData.truncateTables) {
            await db.query(`TRUNCATE TABLE IF EXISTS ${bucketName}.${table}`)
        }
    }

    if (taskData.dropTables) {
        for (const resultTable of taskData.dropTables) {
            await dropTableIfExist({
                ...taskData,
                resultTable
            })
        }
    }
}

export const killMutation = async ({ tableName, databaseName }: { tableName: string; databaseName: string }) => {
    try {
        return await dbGaio().exec(
            `kill mutation 
                where database = {databaseName: String}
                    and table = {tableName: String}`,
            { params: { tableName, databaseName } }
        )
    } catch (e) {
        return { status: 'Cant clear mutation' }
    }
}

export const executeQuery = async ({ at, sql }: { at: TaskType; sql: string }): Promise<GenericType[]> => {
    const db = await new DbService().connect(at)
    return (await db.query(sql)) as Promise<GenericType[]>
}

export const streamToBucket = async ({
    at,
    tableName,
    data
}: {
    at: TaskType
    tableName: string
    data: GenericType[]
}) => {
    return await repositoryInstance(at.repoId as string).insert(
        (at.resultTable || at.databaseName) + '.' + tableName,
        data
    )
}

// export const repoConnection = async (taskData: TaskType) => await new DbService().connect(taskData)
//
export const logComment = (taskData: TaskType) => {
    const { appId, id, type } = taskData
    // const { userId } = this.requestOptions;

    const userId = 'user:1'

    const gaioQt = {
        ref: 'gaio_qt',
        appId: appId || '',
        taskId: id || '',
        userId: userId || '',
        type: type || '',
        flowId: taskData['runningFlowId'] || ''
    }

    return `--log_comment='${JSON.stringify(gaioQt)}'`
}

export const sleep = (time = 1) => new Promise((res) => setTimeout(res, time, 'done sleeping'))
