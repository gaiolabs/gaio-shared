import type { FieldType } from './field.type'
import type { GenericType } from '../generic.type'
import {TaskType} from "../tasks/task.type";

export type MetaViewType = {
	powerType: string
	tableName: string
    metaViewId: string
    userId: string
    appId: string
    repoId: string
    metaId: string
    label: string
    task: TaskType
    tags: FieldType[]
    options: GenericType
    shared: boolean
    modifiedBy: string
    createdBy: string
    modifiedAt: Date
    createdAt: Date
}
