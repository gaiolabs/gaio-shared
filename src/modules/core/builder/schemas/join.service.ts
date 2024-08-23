import type { CommonBuilderTaskType, ParamType, SchemaJoinItemType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import type { Knex } from 'knex'
import { TemplateService } from '../../../shared/template.service'

export class JoinService {
    private template = new TemplateService()

    public build(taskData: CommonBuilderTaskType, parameters: ParamType[], builder: Knex) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superSelf = this
        const schema = taskData.schema

        schema.join.forEach((join) => {
            if (taskData.clickhouse) {
                join.toDatabaseName =
                    join.toDatabaseName || taskData.databaseName || getBucketNameFromAppId(taskData.appId)
                builder.withSchema(join.toDatabaseName)
            }

            // RAW VERIFICATION FIRST IS NEEDED
            if (join.type === 'raw') {
                if (join.raw) {
                    builder.joinRaw(`${this.template.render(`${join.raw}`, parameters)}`)
                }
            } else if (join.type === 'inner') {
                builder.innerJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'left') {
                builder.leftJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'right') {
                builder.rightJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'outer') {
                builder.outerJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'cross') {
                builder.crossJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'leftOuter') {
                builder.leftOuterJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'rightOuter') {
                builder.rightOuterJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            } else if (join.type === 'full') {
                builder.fullOuterJoin(join.to, (joinSelf: Knex.JoinClause) => {
                    join.list.forEach((joinItem) => {
                        superSelf._setReferences(join.by, join.to, joinItem, joinSelf)
                    })
                })
            }
        })

        return builder
    }

    private _setReferences(by: string, to: string, obj: SchemaJoinItemType, join: Knex.JoinClause) {
        if (obj.andOr === 'and') {
            join.andOn(`${by}.${obj.columnBy}`, obj.operator, `${to}.${obj.columnTo}`)
        } else {
            join.orOn(`${by}.${obj.columnBy}`, obj.operator, `${to}.${obj.columnTo}`)
        }
        return join
    }
}
