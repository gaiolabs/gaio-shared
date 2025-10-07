import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type CronTaskType = Partial<{
	cron: string
	cronBase: string
	cronStatus: 'active' | 'inactive'
}>

export type LocalFileTaskType = Partial<{
	type: 'localCsv'
	schemaInference: boolean
	client: string
	newOracle: boolean
	truncateTables: string[]
	dropTables: string[]
	appId: string
	repoId: string
	resultTable: string
	resultDatabase: string
	databaseName: string
	insertMode: boolean
	folderPath: string
	fileFormatType: string
	deleteAfterImport: boolean
	columns: FieldType[]
}> &
	CommonTaskType &
	CronTaskType
