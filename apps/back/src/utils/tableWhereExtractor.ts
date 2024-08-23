import type { SchemaFilterType, TaskType } from '@gaio/types'
import { QueryBuilder } from '@ModulesCore/builder/builder'

export const tableWhereExtractor = async (taskData: TaskType, filters: SchemaFilterType[]) => {
    if (!filters) {
        return ''
    }
    const q = await new QueryBuilder().generate(
        {
            ...taskData,
            schema: {
                filter: filters,
                select: []
            }
        } as TaskType,
        []
    )

    const where = q.match(/where\s(.*?)(?=\sgroup\sby|\sorder\sby|\slimit|$)/g)
    return (where && where[0] ? where[0] : '') as string
}
