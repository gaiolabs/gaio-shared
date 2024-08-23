import type { ParamType, CommonBuilderTaskType, TaskType } from '@gaio/types'
import knex, { type Knex } from 'knex'
import { cloneDeep } from 'lodash-es'
import { FilterService } from './schemas/filter.service'
import { GroupService } from './schemas/group.service'
import { HavingService } from './schemas/having.service'
import { InsertService } from './schemas/insert.service'
import { JoinService } from './schemas/join.service'
import { SelectService } from './schemas/select.service'
import { SortService } from './schemas/sort.service'
import { UpdateService } from './schemas/update.service'
import { throwError } from '../../../utils'

export class QueryBuilder {
    private readonly select = new SelectService()
    private readonly filter = new FilterService()
    private readonly join = new JoinService()
    private readonly group = new GroupService()
    private readonly sort = new SortService()
    private readonly update = new UpdateService()
    private readonly insert = new InsertService()
    private readonly having = new HavingService()

    public async generate<T extends TaskType>(task: T, localParams: ParamType[]) {
        const preserveOriginalClient = task.client
        const taskData = Object.assign({}, task)
        const params = cloneDeep(localParams || [])

        switch (taskData.client) {
            case 'mariadb':
                taskData.client = 'mysql'
                break
            case 'clickhouse':
                taskData['clikchouse'] = true
                taskData.client = 'mysql'
                break
            case 'memsql':
                taskData.client = 'mysql'
                break
            case 'oracle':
                taskData.client = 'oracledb'
                break
            default:
                break
        }

        try {
            const builder: Knex.QueryBuilder = knex({
                client: taskData.client,
                useNullAsDefault: true
            }).from(taskData.tableName)

            const database = taskData.databaseName
            const client = taskData.client
            const schemaName = taskData.schemaName
            this.setSchema(client, database, schemaName, builder)

            this.buildSchema(taskData, params, builder)

            let sql = builder.toString()

            // update on clickhouse
            if (taskData.schema.update && taskData.schema.update.length > 0) {
                const tableNameToRemove = new RegExp(`${taskData.tableName}\\.`, 'g')
                sql = `${sql.substring(sql.indexOf(' set ') + 4)}`.replace(/`/g, '').replace(tableNameToRemove, '')

                sql = `alter table ${database}.${taskData.tableName} update ${sql}`
                if (!taskData.schema.filter[0] || taskData.schema.filter[0].list.length <= 0) {
                    sql += ` where 1=1`
                }
            } else if (taskData.schema.delete) {
                if (!taskData.schema.filter[0] || taskData.schema.filter[0].list.length <= 0) {
                    sql += ` where 1=1`
                }

                const tableNameToRemove = new RegExp(`${taskData.tableName}\\.`, 'g')
                sql = `${sql.substring(sql.indexOf('where ') + 5)}`.replace(/`/g, '').replace(tableNameToRemove, '')
                sql = `alter table ${database}.${taskData.tableName} delete where ${sql}`
            }

            if (taskData.withTotals) {
                let position

                const orderBy = sql.lastIndexOf('order by ')
                const having = sql.lastIndexOf('having ')
                const limit = sql.lastIndexOf('limit ')

                if (orderBy > 0 && having > 0) {
                    position = having
                } else if (orderBy > 0) {
                    position = orderBy
                } else if (having > 0) {
                    position = having
                } else {
                    position = limit
                }

                if (position !== -1) {
                    sql = sql.slice(0, position) + ' with totals ' + sql.slice(position)
                } else {
                    sql = sql = sql + ' with totals '
                }
            }

            // if (taskData.schema.with && taskData.schema.with.content && taskData.schema.with.alias) {
            //     sql = `select * from ( with (${taskData.schema.with.content}) as ${taskData.schema.with.alias} ${sql}) `
            // }

            if (preserveOriginalClient === 'clickhouse') {
                if (taskData.schema.limit && taskData.schema.limitBy && taskData.schema.limitBy.length) {
                    sql += `  BY ` + taskData.schema.limitBy.map((o) => o.alias || o.columnName).toString()
                }
            }

            QueryBuilder.log(taskData.id, ':: sql before transformed -> ', sql)

            if (taskData.client !== 'mssql') {
                return sql
            } else if (
                taskData.client === 'mssql' &&
                taskData.schema?.limit !== undefined &&
                taskData.schema?.offset !== undefined &&
                taskData.schema?.offset > 0
            ) {
                if (taskData.schema.sort && taskData.schema.sort.length > 0) {
                    return sql
                }
                sql = sql
                    .replace(`TOP ${taskData.schema.limit}`, ``)
                    .replace(`top (${taskData.schema.limit})`, ``)
                    .replace(`top ${taskData.schema.limit}`, ``)
                    .replace(`TOP (${taskData.schema.limit})`, ``)
                return `
                        SELECT * FROM (${sql})  
                            WHERE RowNum >= ${taskData.schema.offset}
                        AND RowNum < ${taskData.schema.offset + taskData.schema.limit}`
            } else {
                return sql
            }
        } catch (error) {
            console.log(error.message)
            throw throwError({
                error: 404,
                message: 'Error on generate sql'
            })
        }
    }

    private setSchema(client: string, database: string, schemaName: string, builder: Knex.QueryBuilder) {
        // POSTGRES/ORACLE NEEDS SCHEMA TO BE SET
        if (client === 'pg' && database) {
            builder.withSchema(schemaName)
        } else if (client === 'redshift' && database) {
            builder.withSchema(schemaName)
        } else if (client === 'oracledb' && database) {
            builder.withSchema(database)
        } else if (client === 'mssql' && schemaName) {
            builder.withSchema(schemaName)
        } else {
            database ? builder.withSchema(database) : null
        }

        return builder
    }

    private buildSchema(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex.QueryBuilder) {
        for (const key in taskData.schema) {
            if (taskData.schema.hasOwnProperty(key)) {
                switch (key) {
                    case 'select':
                        builder = this.select.build(taskData, params, builder)

                        break
                    case 'insert':
                        if (taskData.schema.insert.length > 0) {
                            builder = this.insert.build(taskData, params, builder)
                        }
                        break
                    case 'update':
                        if (taskData.schema.update.length > 0) {
                            builder = this.update.build(taskData, params, builder)
                        }
                        break
                    case 'filter':
                        builder = this.filter.build(taskData, params, builder)
                        break
                    case 'having':
                        builder = this.having.build(taskData, params, builder)
                        break
                    case 'join':
                        builder = this.join.build(taskData, params, builder)
                        const database = taskData.databaseName
                        const client = taskData.client
                        const schemaName = taskData.schemaName
                        builder = this.setSchema(client, database, schemaName, builder)
                        break
                    case 'group':
                        builder = this.group.build(taskData, params, builder)
                        break
                    case 'sort':
                        builder = this.sort.build(taskData, params, builder)
                        break
                    case 'limit':
                        if (taskData?.schema?.limit !== undefined && taskData?.schema?.limit > 0) {
                            builder.limit(Number(taskData.schema.limit))
                        }
                        break
                    case 'offset':
                        if (taskData.schema.limit && taskData.schema.limit >= 0) {
                            if (
                                taskData.client !== 'mssql' ||
                                (taskData.client === 'mssql' && taskData.schema.sort && taskData.schema.sort.length > 0)
                            ) {
                                builder.offset(taskData.schema.offset || 0)
                            }
                        }
                        break
                    default:
                        break
                }
            }
        }

        return builder
    }

    private static log(...args: string[]) {
        if (Bun.env.NODE_ENV === 'development') {
            console.log(...args)
        }
    }
}
