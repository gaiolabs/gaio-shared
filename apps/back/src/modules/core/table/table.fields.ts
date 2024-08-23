import type { TaskType } from '@gaio/types'
import type { Context } from 'hono'
import { fieldSchemaQuery } from './info-helpers/field.schema'
import { DbService } from '../../../db/db.service'
import { arrowDataType } from '../../../utils'

const treatField = (client, fields) => {
    for (let field of fields) {
        field.pureType = field.columnType
        if (client === 'oracle' && `${field.dataType}` === 'date') {
            field.dataType = 'datetime'
        } else if (client === 'redshift') {
            field.databaseName = field.databasename || field.databasename?.toUpperCase()
            field.tableName = field.tablename || field.tablename?.toUpperCase()
            field.columnName = field.columnname || field.columnname?.toUpperCase()
            field.columnType = field.columntype || field.columntype?.toUpperCase()
            field.dataType = field.datatype || field.datatype?.toUpperCase()

            delete field.databasename
            delete field.tablename
            delete field.columnname
            delete field.columntype
            delete field.datatype
        }
        field = arrowDataType(field)
    }
}

export const tableFields = async (c: Context) => {
    const { taskData }: { taskData: TaskType } = await c.req.json()
    const db = await new DbService().connect(taskData)

    const query = fieldSchemaQuery(taskData)

    return c.json(
        db
            .query(query)
            .then((res) => {
                treatField(taskData.client, res.data)
                return res
            })
            .catch((err: Error) => {
                return {
                    error: true,
                    message: err.message,
                    query
                }
            })
    )
}
