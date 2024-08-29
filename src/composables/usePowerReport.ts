import { defaultSchema } from '@/composables/default-task/defaultSchema'
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import type { ReportTaskSettingsType } from '@gaio/shared/types'
import { canBeANumber, getId } from '@gaio/shared/utils'
import { cloneDeep, uniq } from 'lodash-es'
import { computed } from 'vue'

const bestVisualOnReport = (view, settings: ReportTaskSettingsType) => {
	if (view.reportType === 'bar') {
		settings.showXGrid = true
		settings.showYGrid = false
		settings.showXTitle = true
		settings.showYTitle = true
	}

	settings.tableBordered = true
	settings.tableStriped = true
	settings.tableHover = true
	settings.tableSm = true

	return settings
}

export function usePowerReport(t, taskData, discoveryTags, metadataFields, currentFilter) {
	const defaultMeasureFormat = {
		formatType: 'decimal',
		formatDecimalSize: 0,
		separators: 'dotComma'
	}

	const operators = ['<=', '>=', '!=', '=', '>', '<', '[']

	const view = {
		reportType: 'table',
		settingType: 'table',
		settings: {}
	}
	let topApplied = false
	const logTree = true
	let path = '[start]'
	let schema
	const task = cloneDeep(taskData)
	const tags = cloneDeep(discoveryTags || [])
	const fields = cloneDeep(metadataFields)
	const userFilter = metadataFields.find((o) => o.userFilter)
	const currentFilterRef = currentFilter
	let resultData

	const loadData = async (task) =>
		await useApi().post('api/table/rows', {
			body: {
				taskData: task,
				params: []
			}
		})

	const prepare = async () => {
		schema = cloneDeep(defaultSchema)

		delete task.fields
		delete task.options
		delete task.user

		console.log('stat schema', schema.select.length)

		filterByUser()

		if (onlyOneBasedDimension.value) {
			await prepareFrequency()
		} else {
			await prepareTree()
		}

		checkIfTopBottomWillBeApplied()
		blockLimitBasedOnReportType()

		// if (task.schema.select.length > 0) {
		//     schema = cloneDeep(task.schema)
		// }

		task.schema = schema

		if (!onlyOneBasedDimension.value) {
			// resultData = await listData(task, schema, schema.limit)
		}

		alwaysSetFrequencyFieldToTheEnd()

		task.reportType = view.reportType
		task.settings.type = view.settingType

		task.settings = bestVisualOnReport(view, task.settings)

		log()

		return {
			task,
			view,
			result: resultData
		}
	}

	function alwaysSetFrequencyFieldToTheEnd() {
		schema.select = schema.select.sort((a, b) => {
			if (a.alias === 'freq') {
				return 1
			}
			if (b.alias === 'freq') {
				return -1
			}
			return 0
		})
	}

	function filterByUser() {
		const userFilterColumnName = userFilter?.columnName
		if (userFilterColumnName) {
			const userFieldOnCurrentLoad = fields.find((o) => o.columnName === userFilterColumnName)

			if (userFieldOnCurrentLoad) {
				if (userFilter) {
					const user = useAuthStore().user

					schema.filter[0].list.push({
						columnName: userFilter.columnName,
						tableName: userFilter.tableName,
						databaseName: userFilter.databaseName,
						type: 'value',
						andOr: 'and',
						value: user.userId,
						operator: '=',
						extraValue: undefined,
						fieldType: 'value',
						valueType: 'value'
					})
				}
			}
		}
	}

	function blockLimitBasedOnReportType() {
		if (view.reportType === 'table') {
			schema.limit = 10
		} else if (view.reportType === 'card') {
			schema.limit = 1
		} else if (!schema.limit) {
			schema.limit = 4000
		}
	}

	function checkIfTopBottomWillBeApplied() {
		for (const tag of tags) {
			if (!topApplied) {
				prepareTopBottom(schema, tag)
			}
			prepareFilterList(schema)
		}
	}

	async function prepareFrequency() {
		const freq = {
			id: getId(6),
			title: t('frequency'),
			computedId: getId(6),
			distinct: false,
			type: 'computed',
			alias: 'freq',
			columnName: 'freq',
			dataType: 'Nullable(Int64)',
			content: 'count(*)',
			...defaultMeasureFormat,
			order: undefined
		}

		schema.computed.push(freq)

		if (nDate.value === 1) {
			path += '::[date][gosogowl]'
			const dateField = transformDateField(dateList.value[0])

			schema.select = [
				dateField,
				{
					columnName: dateList.value[0].columnName,
					tableName: dateList.value[0].tableName,
					databaseName: dateList.value[0].databaseName,
					...freq
				}
			]

			schema.group = [dateField]
			schema.sort = [dateField].map((f) => {
				f['order'] = 'asc'
				return f
			})
			view.reportType = 'area'
			view.settingType = 'area'
			schema.limit = undefined
			checkIfTopBottomWillBeApplied()
			resultData = await listData(task, schema, schema.limit)
		} else {
			path += '::[dimension][ggo5odogh]'

			const dimensionField = dimensionList.value[0]
			schema.select = [
				dimensionField,
				{
					...dimensionField,
					...freq
				}
			]
			schema.group = [dimensionField]
			schema.sort = [freq].map((f) => {
				f.order = 'desc'
				return f
			})
			schema.limit = 10

			view.reportType = 'bar'
			view.settingType = 'bar'
			checkIfTopBottomWillBeApplied()
			resultData = await listData(task, schema, schema.limit)
		}

		path += '::[frequency]'
	}

	const prepareTree = async () => {
		if (nMeasure.value > 0 && !nDate.value && !nDimension.value) {
			path += '::[nmqdqd]*' + nMeasure.value
			schema.select = measureList.value

			view.reportType = 'card'
			view.settingType = ''
			schema.limit = 10
		} else if (nMeasure.value === 2 && nDimension.value === 1 && !nDate.value) {
			path += '::[2m1dqd]'
			schema.select = measureList.value.concat([dimensionList.value[0]])
			schema.sort = [
				{
					order: 'desc',
					...measureList.value[0]
				}
			]
			schema.limit = 10
			view.reportType = 'bar'
			view.settingType = 'bar'
		} else if (nMeasure.value === 1 && nDimension.value === 1 && !nDate.value) {
			path += '::[1m1d1d]'
			schema.select = [measureList.value[0], dimensionList.value[0]]
			schema.sort = [
				{
					order: 'desc',
					...measureList.value[0]
				}
			]
			schema.limit = 10
			view.reportType = 'bar'
			view.settingType = 'bar'
		} else if (nDimension.value === 2 && !nMeasure.value && !nDate.value) {
			path += '::[2iodqmqd - frist sunburst]'

			const dimensionField = { ...dimensionList.value[0] }

			const categoryFrequency = defaultSchema

			const freq = {
				...dimensionField,
				id: getId(6),
				title: t('frequency'),
				computedId: getId(6),
				distinct: false,
				order: 'desc',
				type: 'count',
				alias: 'freq',
				...defaultMeasureFormat,
				columnName: 'freq',
				dataType: 'Nullable(Int64)',
				content: 'count(*)'
			}

			categoryFrequency.computed.push(freq)
			categoryFrequency.select = [dimensionField, freq]

			categoryFrequency.group = [dimensionField]
			categoryFrequency.sort = [freq]
			categoryFrequency.limit = 10
			categoryFrequency.filter = currentFilterRef

			for (const tag of tags) {
				prepareTopBottom(categoryFrequency, tag)
				prepareFilters(categoryFrequency, tag)
			}

			const topCategory = await listData(task, categoryFrequency, categoryFrequency.limit)
			generateInfoStats(topCategory, categoryFrequency.limit)

			schema.computed.push(freq)
			schema.select = [dimensionField, dimensionList.value[1], freq]

			schema.filter = [
				{
					list: [
						...(schema.filter[0] ? schema.filter[0].list : []),
						{
							...dimensionField,
							type: 'value',
							andOr: 'and',
							value: topCategory.data.map((o) => o[dimensionField.columnName]),
							operator: 'in',
							extraValue: undefined,
							forceTableName: true,
							fieldType: 'value',
							tableName: dimensionField.tableName,
							valueType: 'value'
						}
					],
					andOr: 'and',
					operator: '='
				}
			]

			schema.group = [dimensionField, dimensionList.value[1]]
			schema.limit = 3000

			view.reportType = 'treemap'
			view.settingType = 'treemap'
		} else if (nDimension.value > 2 && !nMeasure.value && !nDate.value) {
			path += '::[2dqmqdgjhd]'
			const computedCount = {
				id: getId(6),
				computedId: getId(6),
				distinct: false,
				type: 'count',
				alias: 'freq',
				title: t('frequency'),
				columnName: 'freq',
				...defaultMeasureFormat,
				dataType: 'Nullable(Int64)',
				content: 'count(*)'
			}
			schema.select = dimensionList.value.concat([computedCount])
			schema.group = dimensionList.value
			schema.limit = 10
			schema.computed.push(computedCount)
			schema.sort = [
				{
					...computedCount,
					columnName: 'freq',
					order: 'desc'
				}
			]
			view.reportType = 'table'
			view.settingType = 'table'
		} else if (nDimension.value === 2 && nMeasure.value === 1 && !nDate.value) {
			path += '::[2iodqmqd - second sunburst]'

			const dimensionField = { ...dimensionList.value[0] }

			const categoryFrequency = defaultSchema

			const freq = {
				...dimensionField,
				id: getId(6),
				title: t('frequency'),
				computedId: getId(6),
				distinct: false,
				order: 'desc',
				type: 'count',
				alias: 'freq',
				...defaultMeasureFormat,
				columnName: 'freq',
				dataType: 'Nullable(Int64)',
				content: 'count(*)'
			}

			categoryFrequency.computed.push(freq)
			categoryFrequency.select = [dimensionField, freq]

			categoryFrequency.group = [dimensionField]
			categoryFrequency.sort = [freq]

			categoryFrequency.limit = 10

			categoryFrequency.filter = currentFilterRef

			for (const tag of tags) {
				prepareTopBottom(categoryFrequency, tag)
				prepareFilters(categoryFrequency, tag)
			}

			const topCategory = await listData(task, categoryFrequency, categoryFrequency.limit)
			generateInfoStats(topCategory, categoryFrequency.limit)

			schema.computed.push(freq)
			schema.select = [dimensionField, dimensionList.value[1], measureList.value[0]]

			schema.filter = [
				{
					list: [
						...(schema.filter[0] ? schema.filter[0].list : []),
						{
							...dimensionField,
							type: 'value',
							andOr: 'and',
							value: topCategory.data.map((o) => o[dimensionField.columnName]),
							operator: 'in',
							extraValue: undefined,
							forceTableName: true,
							fieldType: 'value',
							tableName: dimensionField.tableName,
							valueType: 'value'
						}
					],
					andOr: 'and',
					operator: '='
				}
			]

			schema.group = [dimensionField, dimensionList.value[1]]
			schema.limit = 3000

			schema.select = dimensionList.value.concat(measureList.value)
			schema.group = dimensionList.value
			schema.limit = undefined
			schema.sort = [
				{
					...measureList.value[0],
					order: 'desc'
				}
			]
			view.reportType = 'treemap'
			view.settingType = 'treemap'
		} else if (nDimension.value > 2 && nMeasure.value === 1 && !nDate.value) {
			path += '::[2dqmqdgjhd][double]'
			schema.select = dimensionList.value.concat(measureList.value)
			schema.group = dimensionList.value
			schema.limit = undefined
			schema.sort = [
				{
					...measureList.value[0],
					order: 'desc'
				}
			]
			view.reportType = 'table'
		} else if (nDate.value) {
			path += '::[date]'
			const dateField = transformDateField(dateList.value[0])

			schema.group = [dateField]
			schema.sort = [dateField].map((f) => {
				f['order'] = 'asc'
				return f
			})

			if (nDate.value === 1 && nMeasure.value === 1 && nDimension.value === 1) {
				path += '::[1d1m1d][double]'

				const dimensionField = dimensionList.value[0]
				const measureField = measureList.value[0]
				const categoryFrequency = defaultSchema

				const freq = {
					id: getId(6),
					...measureField,
					distinct: false,
					order: 'desc'
				}

				categoryFrequency.computed.push(freq)
				categoryFrequency.select = [dimensionField, freq]

				categoryFrequency.group = [dimensionField]
				categoryFrequency.sort = [freq]

				categoryFrequency.limit = 10

				categoryFrequency.filter = currentFilterRef

				for (const tag of tags) {
					prepareTopBottom(categoryFrequency, tag)
					prepareFilters(categoryFrequency, tag)
				}

				const topCategory = await listData(task, categoryFrequency, categoryFrequency.limit)
				generateInfoStats(topCategory, categoryFrequency.limit)

				const filterCategories = topCategory.data.map((o) => o[dimensionField.columnName])

				schema.select = [dateField, measureList.value[0], dimensionField]
				schema.filter = [
					{
						list: [
							...(schema.filter[0] ? schema.filter[0].list : []),
							{
								...dimensionField,
								type: 'value',
								andOr: 'and',
								value: filterCategories.filter((o) => o),
								operator: 'in',
								extraValue: undefined,
								forceTableName: true,
								fieldType: 'value',
								tableName: dimensionField.tableName,
								valueType: 'value'
							}
						],
						andOr: 'and',
						operator: '='
					}
				]

				if (filterCategories.includes(null) || filterCategories.includes('null')) {
					schema.filter[0].list.push({
						...dimensionField,
						id: getId(6),
						type: 'value',
						andOr: 'or',
						value: '',
						operator: 'isNull',
						fieldType: 'value',
						tableName: dimensionField.tableName,
						valueType: 'value',
						extraValue: ''
					})
				}

				schema.group = [dimensionField, dateField]
				schema.limit = 3000

				view.reportType = 'line'
				view.settingType = 'line'
				view.settings['interactions'] = 'slider'
				view.settings['interactionSliderPosition'] = 'all'
			} else if (nDate.value === 1 && nMeasure.value === 1 && !nDimension.value) {
				path += '::[1d1m1d2]'
				const measureField = measureList.value[0]

				schema.select = [dateField, measureField]

				schema.limit = undefined

				view.reportType = 'area'
				view.settingType = 'area'
			} else if (nDate.value === 1 && nMeasure.value === 2 && !nDimension.value) {
				path += '::[measure]::[measure]'
				schema.select = [dateField, ...measureList.value]
				schema.limit = 10

				view.reportType = 'line'
				view.settingType = 'line'
			} else if (nDate.value === 2 && nMeasure.value === 1 && !nDimension.value) {
				path += '::[measure]::[date]'

				const dateFieldTwo = transformDateField(dateList.value[1])

				const measureField = measureList.value[0]

				schema.select = [dateField, dateFieldTwo, measureField]
				schema.group = [dateField, dateFieldTwo]

				schema.limit = 10

				view.reportType = 'line'
				view.settingType = 'line'
			} else if (nDate.value === 1 && nDimension.value === 1 && !nMeasure.value) {
				path += '::[dimension][fxogolwgos][double]'

				const dimensionField = { ...dimensionList.value[0] }

				const categoryFrequency = defaultSchema

				const freq = {
					...dimensionField,
					id: getId(6),
					title: t('frequency'),
					computedId: getId(6),
					distinct: false,
					order: 'desc',
					type: 'count',
					alias: 'freq',
					...defaultMeasureFormat,
					columnName: 'freq',
					dataType: 'Nullable(Int64)',
					content: 'count(*)'
				}

				categoryFrequency.computed.push(freq)
				categoryFrequency.select = [dimensionField, freq]

				categoryFrequency.group = [dimensionField]
				categoryFrequency.sort = [freq]
				categoryFrequency.limit = 10
				categoryFrequency.filter = currentFilterRef

				for (const tag of tags) {
					prepareTopBottom(categoryFrequency, tag)
					prepareFilters(categoryFrequency, tag)
				}

				const topCategory = await listData(task, categoryFrequency, categoryFrequency.limit)
				generateInfoStats(topCategory, categoryFrequency.limit)

				schema.computed.push(freq)
				schema.select = [dateField, dimensionField, freq]

				schema.filter = [
					{
						list: [
							...(schema.filter[0] ? schema.filter[0].list : []),
							{
								...dimensionField,
								type: 'value',
								andOr: 'and',
								value: topCategory.data.map((o) => o[dimensionField.columnName]),
								operator: 'in',
								extraValue: undefined,
								forceTableName: true,
								fieldType: 'value',
								tableName: dimensionField.tableName,
								valueType: 'value'
							}
						],
						andOr: 'and',
						operator: '='
					}
				]

				schema.group = [dimensionField, dateField]
				schema.limit = 3000

				view.reportType = 'line'
				view.settingType = 'line'
			} else if (nDate.value === 1 && nDimension.value === 2 && !nMeasure.value) {
				path += '::[dimension]::[so0g0sw]'

				const dimensionFieldOne = dimensionList.value[0]
				const dimensionFieldTwo = dimensionList.value[1]

				dimensionFieldOne.type = 'count'
				dimensionFieldTwo.type = 'count'

				schema.select = [dateField, dimensionFieldOne, dimensionFieldTwo]
				schema.group = [dateField]

				schema.limit = 10

				view.reportType = 'table'
				view.settingType = ''
			} else if (nDate.value === 2 && nDimension.value === 1 && !nMeasure.value) {
				path += '::[dimension]::[date]::[freq]'

				const dateFieldTwo = transformDateField(dateList.value[1])
				const dimensionField = dimensionList.value[0]

				const computedCount = {
					id: getId(6),
					computedId: getId(6),
					distinct: false,
					type: 'count',
					alias: 'freq',
					...defaultMeasureFormat,
					columnName: 'freq',
					dataType: 'Nullable(Int64)',
					content: 'count(*)',
					order: 'desc'
				}

				schema.select = [dateField, dateFieldTwo, dimensionField, computedCount]
				schema.group = [dateField, dateFieldTwo]
				schema.computed.push(computedCount)

				schema.sort = [computedCount]
				schema.limit = 10

				view.reportType = 'table'
				view.settingType = ''
			}
		}

		if (!schema.select.length) {
			path += '::[all]::[table]:[fglso]'
			schema.select = dateList.value.concat(dimensionList.value).concat(measureList.value)
			schema.group = dateList.value.concat(dimensionList.value)
			schema.limit = 10
			schema.sort = measureList.value.concat(dateList.value.concat(dimensionList.value)).map((f) => {
				return {
					...f,
					order: 'desc'
				}
			})

			view.reportType = 'table'
			view.settingType = ''
		}
	}

	function prepareTopBottom(schema, tag) {
		let topBottom

		if (tag.variant.startsWith('top ')) {
			topBottom = 'top'
		} else if (tag.variant.startsWith('bottom ')) {
			topBottom = 'bottom'
		}

		if (topBottom) {
			const list = tag.variant.split(' ')

			if (list.length > 1) {
				const top = list[1]
				if (canBeANumber(top)) {
					topApplied = true
					schema.limit = Number(top)
					schema.sort = schema.select
						.filter(
							(o) =>
								o.dataType?.includes('Int') || o.dataType?.includes('Float') || ['count', 'sum', 'avg'].includes(o.type)
						)
						.map((o) => {
							return {
								...o,
								order: topBottom === 'top' ? 'desc' : 'asc'
							}
						})
				}
			}
		}
	}

	const listData = async (task, schemaBase, limit, offset = undefined) => {
		return await loadData({
			...task,
			schema: {
				...schemaBase,
				limit,
				offset
			}
		})
	}

	function transformDateField(field) {
		field.groupDateBy = field.groupDateBy || 'month'

		const computed = {
			id: getId(6),
			computedId: getId(6),
			distinct: false,
			type: 'value',
			alias: '',
			dataType: 'Nullable(Date64)',
			columnName: field.columnName,
			tableName: field.tableName,
			databaseName: field.databaseName,
			originalColumnName: field.columnName,
			content: '',
			title: field.title,
			formatType: 'yearMonth'
		}

		computed.title = field.title || field.alias || field.columnName

		if (field.groupDateBy === 'month') {
			computed.alias = computed.columnName = computed.id + '_yearmonth'
			computed.content = `formatDateTime(${field.columnName}, '%Y%m')`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'yearMonth'
		}

		if (field.groupDateBy === 'year') {
			computed.alias = computed.columnName = computed.id + '_year'
			computed.content = `formatDateTime(${field.columnName}, '%Y')`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'year'
		}

		if (field.groupDateBy === 'day') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `formatDateTime(${field.columnName}, '%Y-%m-%d')`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'date'
		}

		if (field.groupDateBy === 'week') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `concat(toString(toYear(${field.columnName})),'-',toString(toWeek(${field.columnName},7)),'W')`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'week'
		}

		if (field.groupDateBy === 'dateHour') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `formatDateTime(${field.columnName}, '%Y-%m-%d %Hh')`
			computed.formatType = ''
			computed.dataType = 'Nullable(String)'
			computed.type = 'value'
		}

		if (field.groupDateBy === 'dateHourMinute') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `formatDateTime(${field.columnName}, '%Y-%m-%d %Hh%i')`
			computed.dataType = 'Nullable(String)'
			computed.formatType = ''
			computed.type = 'value'
		}

		if (field.groupDateBy === 'dateHourMinuteSecond') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `formatDateTime(${field.columnName}, '%Y-%m-%d %H:%i:%s')`
			computed.dataType = 'Nullable(String)'
			computed.formatType = ''
			computed.type = 'value'
		}

		if (field.groupDateBy === 'quarter') {
			const user = useAuthStore().user

			let quarterName = 'T'

			if (!user.lang.includes('pt')) {
				quarterName = 'Q'
			}

			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `concat(toString(toYear(${field.columnName})),'-',toString(toQuarter(${field.columnName})), '${quarterName}')`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'quarter'
		}

		if (field.groupDateBy === 'semester') {
			computed.alias = computed.columnName = computed.id + '_day'
			computed.content = `concat(toString(toYear(${field.columnName})),if(toMonth(${field.columnName}) <= 6, '-1S', '-2S'))`
			computed.dataType = 'Nullable(Date64)'
			computed.formatType = 'semester'
		}

		schema.computed.push(computed)

		return computed
	}

	function prepareFilterList(schema) {
		schema.filter[0].list = uniq(schema.filter[0].list.concat(currentFilterRef[0].list)).map((o) => {
			if (o['value'] === 'null') {
				o['operator'] = 'isNull'
			}
			return o
		})
	}

	function prepareFilters(schema, tag) {
		if (hasOperator(tag.variant)) {
			const list = termListWhenOperator(tag.variant)
			const field = fields.find(
				(o) => o.title === list[0].trim() || o.alias === list[0].trim() || o.columnName === list[0].trim()
			)

			if (field && list.length === 2) {
				let operator = theOperator(tag.variant)
				let value = list[1].trim()
				let extraValue = undefined

				if (value === 'null') {
					operator = 'isNull'
				} else if (operator === '=') {
					operator = 'in'
					value = value.split(',').map((o) => o.trim())
				} else if (operator === '!=') {
					operator = 'not in'
					value = value.split(',').map((o) => o.trim())
				} else if (operator === '[') {
					operator = 'between'

					const inputValues = value.split(';').map((o) => o.trim().replace(/[[\]]/g, ''))

					if (field.dataType.includes('Date')) {
						if (inputValues[0]) {
							value = inputValues[0]
						}

						if (inputValues[1]) {
							extraValue = inputValues[1]
						}
					} else {
						if (inputValues[0]) {
							if (canBeANumber(inputValues[0])) {
								value = Number(inputValues[0])
							}

							if (canBeANumber(inputValues[1])) {
								extraValue = Number(inputValues[1])
							}
						}
					}
				}

				schema.filter = [
					{
						list: [
							...(schema.filter[0] ? schema.filter[0].list : []),
							{
								...field,
								alias: field.columnName,
								type: 'value',
								andOr: 'and',
								value,
								operator,
								extraValue,
								forceTableName: true,
								fieldType: 'value',
								tableName: field.tableName,
								valueType: 'value'
							}
						],
						andOr: 'and',
						operator: '='
					}
				]
			}
		}
	}

	function hasOperator(searchTerm) {
		return searchTerm ? searchTerm.split('').some((o) => operators.includes(o)) : false
	}

	function theOperator(searchTerm) {
		for (const op of operators) {
			if (searchTerm.includes(op)) {
				return op
			}
		}
		return ''
	}

	function termListWhenOperator(searchTerm) {
		return hasOperator(searchTerm) ? searchTerm.split(theOperator(searchTerm)) : []
	}

	function generateInfoStats(schemaResult, limit) {
		// infoStats = {
		//     ...schemaResult,
		//     limit,
		//     data: null
		// }
	}

	function log() {
		if (logTree) {
			console.log(path + ':::[' + view.reportType + ' && ' + view.settingType + ']')
		}
	}

	const measureList = computed(() => {
		return tags
			.filter((o) => o.type !== 'value')
			.filter((o) => o.dataType && !hasOperator(o.variant))
			.map((o) => {
				if (!o.alias) {
					o.alias = o.columnName
				}
				return o
			})
	})

	const dimensionList = computed(() => {
		return tags
			.filter((o) => o.type === 'value' && !o.dataType?.includes('Date'))
			.filter((o) => o.dataType && !hasOperator(o.variant))
	})

	const dateList = computed(() => {
		return tags
			.filter((o) => o.type === 'value' && o.dataType?.includes('Date'))
			.filter((o) => o.dataType && !hasOperator(o.variant))
	})

	const nMeasure = computed(() => measureList.value.length)

	const nDimension = computed(() => dimensionList.value.length)

	const nDate = computed(() => dateList.value.length)

	const onlyOneBasedDimension = computed(() => {
		return (
			(nDimension.value === 1 && nDate.value <= 0 && nMeasure.value <= 0) ||
			(nDate.value === 1 && nDimension.value <= 0 && nMeasure.value <= 0)
		)
	})

	return {
		prepare
	}
}
