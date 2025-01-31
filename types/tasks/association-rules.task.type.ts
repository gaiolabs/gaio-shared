import { type CommonTaskType } from './common.task.type'

export type AssociationRulesTaskType = Partial<{
	type: 'basket'
	minSupport: number
	resultTable: string
	databaseName: string
	minThreshold: number
	columnCategory: string
	columnReference: string
	associationType: 'fpgrowth' | 'apriori'
}> &
	CommonTaskType

