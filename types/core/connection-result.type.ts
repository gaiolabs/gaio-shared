import type { GenericType } from '../generic.type'

export type ConnectionResultType = Partial<{
	error: boolean
	message: string
	data: GenericType[]
	meta: GenericType[]
	query: string
	rows: number
	rows_before_limit_at_least: number
	statistics: Partial<{
		elapsed: number
		rows_read: number
		bytes_read: number
	}>
}> &
	GenericType
