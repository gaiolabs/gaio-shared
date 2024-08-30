<template>
	<div
		v-if="task"
		class="report-table"
	>
		<!-- FIX .icon later-->
		<div
			class="overflow-hidden rounded border bg-paper-100 dark:bg-carbon-100"
			:style="{ height: cardHeight }"
		>
			<report-node-header
				:task="task"
				:table-rows="tableRows"
			/>
			<div
				class="px-1 pb-2"
				:style="{ height }"
			>
				<NSpin :show="loading">
					<div class="table-responsive mb-2">
						<NTable
							class="table"
							:bordered="tableStyle.bordered"
							:bottom-bordered="false"
							:single-column="tableStyle.singleColumn"
							:single-line="tableStyle.singleLine"
							:size="tableStyle.size"
							:striped="tableStyle.striped"
						>
							<thead>
								<tr>
									<th
										v-if="formPosition.atStart"
										class="w-[30px]"
									/>
									<th
										v-for="col of columns"
										:key="col.id"
									>
										{{ defineColumnTitle(col) }}
									</th>
									<th
										v-if="formPosition.atEnd"
										class="w-[30px]"
									/>
								</tr>
								<!--SUMMARIZE AT HEADER-->
								<tr v-if="showTotalAt('header')">
									<th
										v-if="formPosition.atStart"
										class="w-[30px]"
									/>
									<template
										v-for="col in columns.filter((o) => !o.hidden)"
										:key="col.id"
									>
										<th
											style="border-bottom-width: 4px"
											:style="preFormatStyle(col)"
										>
											{{ summarize(col) }}
										</th>
									</template>
									<th
										v-if="formPosition.atEnd"
										class="w-[30px]"
									/>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(row, rowIndex) in list"
									:key="rowIndex"
								>
									<td
										v-if="formPosition.atStart"
										class="w-[30px] text-center"
									>
										<report-table-form
											:task="task"
											:row="row"
											@trigger="$emit('trigger', $event)"
										/>
									</td>

									<template
										v-for="col in columns.filter((o) => !o.hidden)"
										:key="col.id"
									>
										<template
											v-if="
												row[`${defineColumnName(col)}#rowSpan`] && row[`${defineColumnName(col)}#rowSpan`] > 0 ?
													row[`${defineColumnName(col)}#rowSpanStart`]
												:	true
											"
										>
											<td
												:style="generateStyle(row, col)"
												:class="generateClass(row, col)"
												:rowspan="
													row[`${defineColumnName(col)}#rowSpanStart`] ? row[`${defineColumnName(col)}#rowSpan`] : null
												"
											>
												<template v-if="!col.accumulated">
													<template v-if="col.linkValue">
														<NButton
															text
															:color="linkColor(col)"
															@click="setParameters(col.linkType, col.linkValue, row)"
														>
															<span
																v-if="col.html"
																class="w-100"
																v-html="row[col.alias || col.columnName]"
															/>
															<template v-else>
																{{ formatRowValue(row, col) }}
															</template>
														</NButton>
													</template>
													<template v-else-if="col.html">
														<span
															class="table-html"
															v-html="row[col.alias || col.columnName]"
														/>
													</template>
													<template v-else>
														<span>
															{{ formatRowValue(row, col) }}
														</span>
													</template>
													<!--                                                    <template v-if="generateStyle(row, col).icon">-->
													<!--                                                        <g-app-icon-->
													<!--                                                            class="mx-1"-->
													<!--                                                            :name="generateStyle(row, col).icon"-->
													<!--                                                        />-->
													<!--                                                    </template>-->
												</template>
											</td>
										</template>
									</template>
									<td
										v-if="formPosition.atEnd"
										class="w-[30px] text-center"
									>
										<report-table-form
											:task="task"
											:row="row"
											@trigger="$emit('trigger', $event)"
										/>
									</td>
								</tr>
							</tbody>
							<!--SUMMARIZE AT FOOTER-->
							<template v-if="list.length && !loading && showTotalAt('footer')">
								<tfoot>
									<tr v-if="showTotalAt('header')">
										<td
											v-if="formPosition.atStart"
											class="w-[30px]"
										/>
										<template
											v-for="col in columns.filter((o) => !o.hidden)"
											:key="col.id"
										>
											<td
												style="border-bottom-width: 4px"
												:style="preFormatStyle(col)"
											>
												{{ summarize(col) }}
											</td>
										</template>
										<td
											v-if="formPosition.atEnd"
											class="w-[30px]"
										/>
									</tr>
								</tfoot>
							</template>
						</NTable>
					</div>
				</NSpin>

				<div
					v-if="tableRows > list.length"
					class="flex w-full justify-center pb-2"
				>
					<NPagination
						v-model:page="pagination.page"
						:item-count="tableRows"
						size="small"
						@update:page="loadData"
					>
						<template #prefix="{ itemCount }">{{ itemCount }} {{ $t('total') }}</template>
					</NPagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useFormatByRules from '@/composables/useFormatByRules'
import useFormatValue from '@/composables/useFormatValue'
import { useAppStore } from '@/stores'
import ReportTableForm from '@/views/report/report-table/ReportTableForm.vue'
import ReportNodeHeader from '@/views/report/ReportNodeHeader.vue'
import { type FieldType, type ReportNodeType, type SchemaSortType } from '@gaio/shared/types'
import { cloneDeep, take } from 'lodash-es'
import { computed, type CSSProperties, onMounted, ref } from 'vue'

const emit = defineEmits(['trigger'])
const props = defineProps<{ task: ReportNodeType; height: string; cardHeight: string }>()
const { formatValue } = useFormatValue()
const { formatStyleByRules } = useFormatByRules()
const loading = ref(false)
const list = ref([])
const totals = ref({})
const tableRows = ref(0)

const settings = computed(() => props.task.settings)

const pagination = ref({
	page: 1,
	pageCount: 100
})

// const formatColumnStyle = (col: FieldType): CSSProperties => {
//     return {
//         fontWeight: col.fontWeight,
//         textAlign: col.textAlign,
//         fontSize: col.fontSize,
//         color: col.fontColor,
//         wordBreak: col.tableWordBreak
//     }
// }

const generateClass = (row, col) => {
	let localClass = ''
	if (row[col.alias || col.columnName] && `${row[col.alias || col.columnName]}`.includes('█')) {
		localClass = 'has-monospace'
	}
	return localClass
}

const generateStyle = (row, col) => {
	let fontFamily = {}

	if (row[col.alias || col.columnName] && `${row[col.alias || col.columnName]}`.includes('█')) {
		fontFamily = { fontFamily: 'monospace !important' }
	}

	let whiteSpace = {}

	if (settings.value.bodyWordWrap === true) {
		whiteSpace = { whiteSpace: 'normal !important' }
	}

	return {
		...preFormatStyle(col),
		...formatStyleByRules(row, col),
		...fontFamily,
		...whiteSpace
	} as Partial<CSSProperties>
}

const tableStyle = computed(() => {
	return {
		bordered: settings.value.tableBordered,
		striped: settings.value.tableStriped,
		size: settings.value.tableSm ? 'small' : 'medium',
		singleLine: !settings.value.tableSingleLine,
		singleColumn: !settings.value.tableSingleColumn
	}
})

const linkColor = (col: FieldType) => {
	return col.linkValueColor || 'blue'
}

const setParameters = (linkType, linkValue, row) => {
	const params = cloneDeep(useAppStore().params)

	props.task.schema.select.forEach((c) => {
		const paramName = c.alias || c.columnName
		params.forEach((f, k) => {
			if (f.paramName === paramName) {
				params[k].paramValue = row[paramName]
			}
		})
	})

	useAppStore().params = params

	// await this.$store.dispatch('app/setParams', params);

	// const flow = useAppStore().flowList.find((o) => o.flowId === linkValue)

	// if (flow) {
	//     // clear cache of task to rebuild data
	//     const tasks = flow.workflow.nodes.map((o) => o.id);
	//     await this.$store.commit('report/RESET_BY_ID', tasks);
	// }

	console.log('linkType', linkType, linkValue, row)

	// DO ACTION
	switch (linkType) {
		case 'link':
			emit('trigger', { flowId: linkValue })
			break
		default:
			console.log('form')
			break
	}
}

const defineColumnTitle = (col: FieldType) => {
	return col.title || col.alias || col.columnName
}

const defineColumnName = (col: FieldType) => {
	return col.alias || col.columnName
}

const columns = computed(() => {
	return props.task.schema.select || []
})

const loadData = async () => {
	loading.value = true
	const taskData = cloneDeep(props.task)

	taskData.schema.limit = taskData.settings.pageSize
	taskData.schema.offset = pagination.value.page <= 1 ? 0 : (pagination.value.page - 1) * taskData.schema.limit

	if (taskData.settings.groupEqualCategory) {
		taskData.schema.sort = taskData.schema.select.filter((o) => !o.hidden && o.type === 'value') as SchemaSortType[]
	}

	useApi()
		.post('api/table/report', {
			body: {
				taskData,
				params: useAppStore().params
			}
		})
		.then((res) => {
			tableRows.value = res.rows_before_limit_at_least
			list.value = take(res.data, taskData.schema.limit || 10)
			loading.value = false
		})
		.catch(() => {
			loading.value = false
		})
}

const formatStyle = (col: FieldType) => {
	return {
		color: col.fontColor || 'inherit',
		fontSize: col.fontSize ? col.fontSize + 'px' : 'inherit',
		textAlign: col.textAlign || 'left',
		fontWeight: col.fontWeight || '400',
		whiteSpace: col.wordBreak ? 'normal !important' : null
	}
}

const formatRowValue = (row, col) => {
	const truncateLine = formatValue(row[col.alias || col.columnName], col) as string

	if (settings.value?.maxlength && col.dataType?.includes('String')) {
		return truncate(truncateLine, settings.value?.maxlength)
	} else {
		return truncateLine
	}
}

const truncate = (str: string, maxlength: number) => {
	if (str) {
		return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str
	}
	return ''
}

const preFormatStyle = (col: FieldType) => {
	col.bodyWordWrap = settings.value.bodyWordWrap

	if (col.bodyWordWrap === true) {
		// return truncate(
		//     formatStyle({
		//         ...col,
		//         wordBreak: true
		//     } as FieldType),
		//     settings.value.maxlength
		// )
	} else {
		return formatStyle(col)
	}
}

const showTotalAt = (position) => {
	if (settings.value.totalPosition === 'headerFooter') {
		return totalColumns.value.length > 0
	} else {
		return (
			totalColumns.value.filter((o) => o.alias !== '_horizontal_total').length > 0 &&
			settings.value.totalPosition === position
		)
	}
}

const summarize = (col) => {
	if (col.alias === '_horizontal_total') {
		return formatValue(
			list.value.reduce((acc, curr) => {
				return acc + Number(curr[col.alias || col.columnName])
			}, 0),
			col
		)
	}

	if (col.showTotal) {
		return formatValue(totals.value[defineColumnName(col)], col)
	}

	return ''
}

const totalColumns = computed(() => {
	return columns.value.filter((o) => o.showTotal) || []
})

const formPosition = computed(() => {
	return {
		atStart: settings.value.forms.length && settings.value.formOnFirstColumn,
		atEnd: settings.value.forms.length && !settings.value.formOnFirstColumn
	}
})

onMounted(() => loadData())
</script>
