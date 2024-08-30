<template>
	<div
		v-if="localTask"
		class="table-stats"
	>
		<div class="g-bg-1 mb-3 rounded p-2">
			<div class="table-data-header mb-3 mt-2 flex justify-between">
				<table-data-filter
					:columns="columns"
					:local-task="localTask"
					:total-rows="totalRows"
					:total-rows-filtered="totalRowsFiltered"
					class="flex-grow"
					@load-filter="applyFilter"
				/>
			</div>
		</div>

		<div class="flex gap-2">
			<div class="min-w-[250px]">
				<div class="mb-2 flex justify-between">
					<div>{{ $t('columns') }}</div>
					<div>
						<NButton
							v-if="isRunning"
							size="tiny"
							tertiary
							type="error"
							@click="isDestroyed = true"
						>
							{{ $t('stop') }}
						</NButton>
						<NButton
							v-else
							size="tiny"
							tertiary
							type="primary"
							@click="runAll"
						>
							{{ $t('all') }}
						</NButton>
					</div>
				</div>

				<div class="g-bg-1 mb-3 rounded p-1">
					<n-input
						v-model:value="searchTerm"
						:placeholder="$t('filter')"
						min="1"
						max="100"
						step="1"
					/>
				</div>

				<n-table
					size="small"
					class="g-bg-2"
				>
					<tbody>
						<tr
							v-for="col of $filterBy(columns, 'columnName', searchTerm)"
							:key="col.columnName"
						>
							<td>
								<div class="flex items-center justify-between">
									<div class="truncate">
										<g-data-type-icon :data-type="col.dataType" />
										{{ col.columnName }}
									</div>
									<n-switch
										v-model:value="selected[col.columnName]"
										size="small"
										:round="false"
										@update:value="runSelected(col)"
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</n-table>
				<!--                <div-->
				<!--                    v-for="col of columns"-->
				<!--                    :key="col.columnName"-->
				<!--                    class="g-bg-1 mb-1 flex items-center justify-between gap-2 rounded p-1"-->
				<!--                >-->
				<!--                    <div>-->
				<!--                        <g-data-type-icon :data-type="col.dataType" />-->
				<!--                        {{ col.columnName }}-->
				<!--                    </div>-->
				<!--                    <n-switch-->
				<!--                        v-model:value="selected[col.columnName]"-->
				<!--                        size="small"-->
				<!--                        :round="false"-->
				<!--                        @update:value="runSelected(col)"-->
				<!--                    />-->
				<!--                </div>-->
			</div>
			<div
				ref="leftContainer"
				class="flex-grow overflow-x-hidden"
			>
				<div
					class="g-bg-1 rounded p-2"
					:class="{ 'flex items-center justify-center': localData.length === 0 }"
				>
					<n-empty
						v-if="localData.length === 0"
						:description="$t('noData')"
					/>
					<div
						v-else
						class="w-fit-content overflow-x-scroll"
					>
						<n-table
							striped
							:single-line="false"
							size="small"
						>
							<thead>
								<tr class="*:!text-right first:*:!text-left">
									<th>{{ t('column') }}</th>
									<th>{{ t('avg') }}</th>
									<th v-if="localTask.client === 'clickhouse'">{{ t('median') }}</th>
									<th>{{ t('min') }}</th>
									<th>{{ t('max') }}</th>
									<th>{{ t('sum') }}</th>
									<th>{{ t('count') }}</th>
									<th>{{ t('countDistinct') }}</th>
									<th>{{ t('standardDeviation') }}</th>
									<th>{{ t('emptyOrNull') }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="item in localData"
									:key="item.columnName"
									class="*:!text-right first:*:!text-left"
								>
									<td>
										<g-data-type-icon :data-type="item.dataType" />

										{{ item.columnName }}
									</td>
									<td>{{ item.average }}</td>
									<td v-if="localTask.client === 'clickhouse'">{{ item.median }}</td>
									<td>{{ item.minimum }}</td>
									<td>{{ item.maximum }}</td>
									<td>{{ item.sum }}</td>
									<td>{{ item.count }}</td>
									<td>{{ item.countDistinct }}</td>
									<td>{{ item.standardDeviation }}</td>
									<td>{{ item.empty }}</td>
								</tr>
							</tbody>
						</n-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useFormatValue from '@/composables/useFormatValue'
import { useTableStore } from '@/stores'
import TableDataFilter from '@/views/studio/canvas/table-view/TableDataFilter.vue'
import type { BuilderTaskType, FieldType, GenericType } from '@gaio/shared/types'
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { dataTypeIsNumeric, dataTypeIsDate, dataTypeIsDateTime } = useDataType()
const { t } = useI18n()
const emit = defineEmits(['load'])

const searchTerm = ref('')
const leftContainer = ref()

const props = defineProps<{
	localTask: BuilderTaskType
	columns: FieldType[]
	totalRows: number
	loading: boolean
}>()

const totalRowsFiltered = ref(0)
const selected = ref<GenericType>({})
const isDestroyed = ref(false)
const isRunning = ref(false)
const localData = ref([])
const { formatValue } = useFormatValue()

const applyFilter = async () => {
	isRunning.value = true
	for await (const col of props.columns) {
		if (isDestroyed.value) {
			isRunning.value = false
			isDestroyed.value = false
			break
		}
		if (selected.value[col.columnName]) {
			await runSelected(col)
		}
	}
	isRunning.value = false
}

const formatRow = (val, dec = 0) => {
	return formatValue(val, {
		formatType: 'decimal',
		formatDecimalSize: dec,
		separators: 'dotComma'
	})
}

const loadStats = async (col: FieldType) => {
	emit('load', true)

	localData.value = localData.value.filter((item) => item.columnName !== col.columnName)

	if (dataTypeIsNumeric(col.dataType)) {
		const { data } = await useApi().post(`api/table/stats`, {
			body: {
				taskData: {
					...props.localTask,

					columnName: col.columnName
				},
				filters: useTableStore().getFilter(props.localTask)
			}
		})

		const result = data[0]

		if (result) {
			localData.value.push({
				...result[0],
				dataType: col.dataType,
				columnName: col.columnName,
				median: formatRow(result.median, 3),
				average: formatRow(result.average, 3),
				minimum: formatRow(result.minimum, 3),
				maximum: formatRow(result.maximum, 3),
				standardDeviation: formatRow(result.standardDeviation, 3),
				sum: formatRow(result.sum),
				count: formatRow(result.count),
				countDistinct: formatRow(result.countDistinct),
				empty: formatRow(result.empty)
			})
		}
	} else {
		let minResult: string
		let maxResult: string
		let medianResult: string

		const { totalEmptyRows: empty } = await useApi().post('api/table/empty', {
			body: {
				taskData: {
					...props.localTask,
					columnName: col.columnName
				},
				filters: useTableStore().getFilter(props.localTask)
			}
		})

		const { totalDistinctRows: countDistinct, totalRows: count } = await useApi().post('api/table/count-distinct', {
			body: {
				taskData: {
					...props.localTask,
					columnName: col.columnName
				},
				filters: useTableStore().getFilter(props.localTask)
			}
		})

		if (dataTypeIsDate(col.dataType) || dataTypeIsDateTime(col.dataType)) {
			const { min, max, median } = await useApi().post('api/table/min-max', {
				body: {
					taskData: {
						...props.localTask,
						columnName: col.columnName
					},
					filters: useTableStore().getFilter(props.localTask)
				}
			})

			minResult = min
			maxResult = max
			medianResult = median
		}

		localData.value.push({
			dataType: col.dataType,
			columnName: col.columnName,
			minimum: minResult,
			maximum: maxResult,
			median: medianResult,
			countDistinct: formatRow(countDistinct),
			count: formatRow(count),
			empty: formatRow(empty)
		})
	}
}

const runSelected = async (col: FieldType) => {
	if (selected.value[col.columnName]) {
		await loadStats(col)
	}
}

const runAll = async () => {
	isRunning.value = true
	for await (const col of props.columns) {
		if (isDestroyed.value) {
			isRunning.value = false
			isDestroyed.value = false
			break
		}
		if (!selected.value[col.columnName]) {
			selected.value[col.columnName] = true
			await loadStats(col)
		}
	}
	isRunning.value = false
}

onBeforeUnmount(() => (isDestroyed.value = true))
</script>
