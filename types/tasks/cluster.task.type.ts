import { FieldType } from '../core/field.type'
import { type CommonTaskType } from './common.task.type'

export type ClusterTaskType = Partial<{
	type: 'cluster'
	excludeColumns: string[]
	estimateK: boolean
	executionTime: number
	clusterSize: number
	columns: FieldType[]
}> &
	CommonTaskType
