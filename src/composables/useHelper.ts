import type { FieldType, GenericType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { drop } from 'lodash-es'

interface Data {
	[prop: string]: string | number | boolean
}

export default () => {
	const alpha = (str: string) => {
		if (!str) return ''
		return str.replace(/[^a-zA-Z0-9]/g, '_').trim()
	}

	const generateId = (size = 8) => getId(size)

	const getPaginatedItems = <T>(items: T[], currentPage: number, pageSize: number = (items || []).length) => {
		const pg = currentPage || 1,
			pgSize = pageSize || 100,
			offset = (pg - 1) * pgSize,
			pagedItems = drop(items, offset).slice(0, pgSize)
		return {
			page: pg,
			pageSize: pgSize,
			total: items.length,
			totalPages: Math.ceil(items.length / pgSize),
			data: pagedItems as T[]
		}
	}

	const getTableScrollableArea = (
		dataList: Data[],
		columns: FieldType[],
		computeProp: string,
		contentHeight: number,
		clone: boolean = false
	): { x: number; y: number } => {
		const list = columns.map((column, index) => {
			const columnValues = dataList.map((item) => {
				return item[computeProp] ? item[computeProp].toString() : ''
			})

			const maxColumnValueSize = Math.max(...columnValues.map((item) => item.length))

			const maxColumnNameSize = (`${column[computeProp] ? column[computeProp] : ''}`?.length || 0) + 2

			const width = maxColumnNameSize > maxColumnValueSize ? maxColumnNameSize : maxColumnValueSize

			if (clone) {
				columns[index].width = width * 12
			}

			return {
				...column,
				width: width * 12
			}
		})

		return {
			x: list.reduce((acc, column) => acc + (column.width || 0), 0),
			y: contentHeight
		}
	}

	const executablesNodes = [
		'builder',
		'pca',
		'insert',
		'pivot',
		'query',
		'fileImport',
		'export',
		'scoring',
		'paramToTable',
		'tableToParam',
		'rest',
		'whatsapp',
		'r',
		'mail',
		'flow',
		'automl',
		'userMirror',
		'castData',
		'update',
		'delete',
		'insertRow',
		'create',
		'timeseries',
		'sourceRaw',
		'basket',
		'cluster',
		'coxph',
		'sample',
		'externalOutput',
		'csvUrl',
		'unpivot',
		'cloudStorage',
		'googleSpreadsheet',
		'scorecard',
		'nodeEdge',
		'nodeEdgeFilter',
		'localCsv',
		'python'
	]

	const reportsNodes = ['form', 'report', 'maps', 'network', 'powerSearch', 'scorecard']

	function millisecondsToTime(duration: number): string {
		const milliseconds = duration % 1000
		const seconds = Math.floor((duration / 1000) % 60)
		const minutes = Math.floor((duration / (1000 * 60)) % 60)
		const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
		const days = Math.floor(duration / (1000 * 60 * 60 * 24))

		if (days > 0) {
			return `${days}d`
		} else if (hours > 0) {
			return `${hours}.${Math.floor(minutes / 6)} h`
		} else if (minutes > 0) {
			return `${minutes}.${Math.floor(seconds / 6)} m`
		} else if (seconds > 0) {
			return `${seconds}.${milliseconds} s`
		} else {
			return `${milliseconds} ms`
		}
	}

	// const fixFieldName = (name: string) => {
	//     const api = `${name || ''}`
	//
	//     return api ?
	//             deburr(
	//                 api
	//                     .toString()
	//                     .replace(/\s/g, '')
	//                     .replace(/-/g, '_')
	//                     .replace('.', '')
	//                     .replace('`', '')
	//                     .replace(/[&\/\\#,+()$~%.'";|!ˆ^~˜:*?<>{}]/g, '')
	//                     .normalize('NFD')
	//                     .replace(/[\u0300-\u036f]/g, '')
	//             )
	//         :   ''
	// }

	const processTerm = (term) => {
		return term
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
	}

	const filterBy = <T>(list: T[], by: string | string[], term: string = ''): T[] => {
		const processedTerm = processTerm(term)

		if (!processedTerm) {
			return list
		}

		return list.filter((item) => {
			if (typeof by === 'string') {
				return processTerm(item[by] || '').includes(processedTerm)
			} else {
				return by.some((field) => processTerm(item[field] || '').includes(processedTerm))
			}
		})
	}

	const normalize = (value: string) => {
		// used to create good columns that fits on mysql database
		return value ?
				value
					.toString()
					.replace(/\s/g, '')
					.replace(/-/g, '_')
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
			:	''
	}

	const search = (list: GenericType[], term: string, min = 1, limit = 500) => {
		if (!term || term.length < min) return list

		const normalizedTerm = term
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
		const columns = list && list.length > 0 ? Object.keys(list[0]) : []

		const filteredList = list.filter((item) => {
			const sentence = columns.reduce((prev, col) => {
				const val = item[col]
				const contents = typeof val === 'object' ? JSON.stringify(val) : String(val)
				return prev + contents.toLowerCase()
			}, '')

			const normalizedSentence = sentence.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			return normalizedSentence.includes(normalizedTerm)
		})

		return filteredList.slice(0, limit)
	}

	const operatorsFilters: Record<string, { name: string; operator: string; options?: string[] }[]> = {
		text: [
			{ name: 'opEqualTo', operator: '=', options: ['value'] },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opContain', operator: 'like' },
			{ name: 'opDoesNotContain', operator: 'notLike' },
			{ name: 'opStartsWith', operator: 'startsWith' },
			{ name: 'opDoesNotStartWith', operator: 'doesNotStartsWith' },
			{ name: 'opEndsWith', operator: 'endsWith' },
			{ name: 'opDoesNotEndWith', operator: 'doesNotEndsWith' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],
		number: [
			{ name: 'opEqualTo', operator: '=' },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opBetween', operator: 'between' },
			{ name: 'opNotBetween', operator: 'notBetween' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],
		datetime: [
			{ name: 'opEqualTo', operator: '=' },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opBetween', operator: 'between' },
			{ name: 'opNotBetween', operator: 'notBetween' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],

		date: [
			{ name: 'opEqualTo', operator: '=' },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opBetween', operator: 'between' },
			{ name: 'opNotBetween', operator: 'notBetween' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],
		time: [
			{ name: 'opEqualTo', operator: '=' },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opBetween', operator: 'between' },
			{ name: 'opNotBetween', operator: 'notBetween' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],
		conditionals: [
			{ name: 'opEqualTo', operator: '=' },
			{ name: 'opContain', operator: 'like' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opBetween', operator: 'between' }
		],
		tableFilter: [
			{ name: 'opEqualTo', operator: '=', options: ['value'] },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opContain', operator: 'like' },
			{ name: 'opDoesNotContain', operator: 'notLike' },
			{ name: 'opStartsWith', operator: 'startsWith' },
			{ name: 'opDoesNotStartWith', operator: 'doesNotStartsWith' },
			{ name: 'opEndsWith', operator: 'endsWith' },
			{ name: 'opDoesNotEndWith', operator: 'doesNotEndsWith' },
			{ name: 'opIsNull', operator: 'isNull' },
			{ name: 'opIsNotNull', operator: 'isNotNull' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		],
		reportTable: [
			{ name: 'opEqualTo', operator: '=', options: ['value'] },
			{ name: 'opNotEqualTo', operator: '!=' },
			{ name: 'opLessThan', operator: '<' },
			{ name: 'opLessThanOrEqualTo', operator: '<=' },
			{ name: 'opGreaterThan', operator: '>' },
			{ name: 'opGreaterThanOrEqualTo', operator: '>=' },
			{ name: 'opContain', operator: 'like' },
			{ name: 'opDoesNotContain', operator: 'notLike' },
			{ name: 'opStartsWith', operator: 'startsWith' },
			{ name: 'opDoesNotStartWith', operator: 'doesNotStartsWith' },
			{ name: 'opEndsWith', operator: 'endsWith' },
			{ name: 'opDoesNotEndWith', operator: 'doesNotEndsWith' },
			{ name: 'opWhereIn', operator: 'in' },
			{ name: 'opWhereNotIn', operator: 'notIn' }
		]
	}

	return {
		generateId,
		millisecondsToTime,
		operatorsFilters,
		executablesNodes,
		reportsNodes,
		getTableScrollableArea,
		getPaginatedItems,
		filterBy,
		normalize,
		search,
		alpha
	}
}
