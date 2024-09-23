<template>
	<div class="filter-builder">
		<div
			v-if="hasFilter"
			class="canvas-task-update-body"
		>
			<NCard
				v-if="columns"
				content-style="padding: 10px"
			>
				<table
					v-if="localTask.schema.filter[0].list.length > 0"
					class="w-full table-auto"
				>
					<thead>
						<tr class="vertical-mid border-b text-left *:p-1">
							<th
								class="el-text-center"
								style="width: 45px"
							>
								<NButton
									size="tiny"
									secondary
									@click="addCol()"
								>
									<template #icon>
										<g-icon name="add" />
									</template>
								</NButton>
							</th>
							<th>{{ $t('column') }}</th>
							<th>{{ $t('type') }}</th>
							<th>{{ $t('operator') }}</th>
							<th>{{ $t('value') }}</th>
							<th style="width: 25px"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in localTask.schema.filter[0].list"
							:key="index"
							class="vertical-mid border-b text-left *:p-1 odd:bg-paper-200"
						>
							<td
								v-if="index > 0"
								class="text-right"
							>
								<NButton
									size="tiny"
									type="primary"
									@click="item.andOr = item.andOr === 'and' ? 'or' : 'and'"
								>
									{{ item.andOr }}
								</NButton>
							</td>
							<td v-else></td>
							<td>
								<NSelect
									v-model:value="item.columnName"
									filterable
									:options="columnList"
									value-field="columnName"
									label-field="columnName"
									@update:value="changeFilter(item)"
								/>
							</td>
							<td>
								<NSelect
									v-model:value="item.valueType"
									:options="[
										{
											value: 'value',
											label: $t('value'),
										},
										{
											value: 'parameter',
											label: $t('parameter'),
										},
										{
											value: 'computed',
											label: $t('computed'),
										},
									]"
									class="min-w-[100px]"
								/>
							</td>
							<td>
								<NSelect
									v-model:value="item.operator"
									filterable
									:options="operators(item)"
								/>
							</td>
							<td>
								<span v-if="!['isNull', 'isNotNull'].includes(item.operator)">
									<span v-if="item.valueType === 'value'">
										<NInputGroup v-if="!['in', 'notIn'].includes(item.operator)">
											<NInput
												v-model:value="item.value"
												:placeholder="$t('value')"
												type="text"
											/>
											<NPopover
												:width="350"
												trigger="click"
											>
												<NSelect
													v-model:value="item.value"
													filterable
													clearable
													:placeholder="$t('filter')"
													:options="columnValues[item.columnName]"
												/>
												<template #trigger>
													<NButton
														:underline="false"
														class="w-100 h-100"
														@click="listByField(item)"
													>
														<g-icon name="eye" />
													</NButton>
												</template>
											</NPopover>
										</NInputGroup>
										<template v-else>
											<NSelect
												v-model:value="item.value"
												tag
												multiple
												filterable
												clearable
												:placeholder="$t('filter')"
												:options="columnValues[item.columnName]"
												@focus="listByField(item)"
											/>
										</template>
									</span>
									<template v-else-if="item.valueType === 'parameter'">
										<NSelect
											v-model:value="item.value"
											class="w-100"
											filterable
											value-field="paramName"
											label-field="paramName"
											:options="params"
										/>
									</template>
									<template v-else-if="item.valueType === 'computed'">
										<div class="control-label">
											{{ $t('computed') }}
										</div>
										<div
											class="control"
											style="min-height: 90px"
										>
											<code-editor
												v-model="item.value"
												class="h-[90px] min-w-[250px] overflow-hidden rounded"
												:labels="columns.map((o) => o.columnName)"
											/>
										</div>
									</template>
								</span>
							</td>
							<td>
								<NButton
									size="tiny"
									quaternary
									type="error"
									@click="deleteFilter(item.id)"
								>
									<template #icon>
										<IconComponent name="Delete" />
									</template>
								</NButton>
							</td>
						</tr>
					</tbody>
				</table>
				<div
					v-else
					class="w-100"
				>
					<NAlert :closable="false">
						<div class="flex w-full items-center justify-between">
							<div class="grow">
								{{ $t('addFilter') }}
							</div>
							<div>
								<NButton
									type="primary"
									@click="addCol()"
								>
									{{ $t('add') }}
								</NButton>
							</div>
						</div>
					</NAlert>
				</div>
			</NCard>
		</div>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { NButton, NInputGroup } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	localTask: {
		type: Object as () => BuilderTaskType,
		required: true,
		default: () => ({}) as BuilderTaskType,
	},
	tableName: {
		type: String,
		required: true,
	},
})

const { dataTypeName } = useDataType()
const { operatorsFilters } = useHelper()

const columnValues = ref({})
const columns = ref([])

const listByField = (col: FieldType) => {
	useApi()
		.post('api/table/rows', {
			body: {
				params: useAppStore().params,
				taskData: {
					...props.localTask,
					schema: {
						select: [
							{
								...col,
								type: 'value',
								distinct: true,
							},
						],
						sort: [{ ...col, alias: col.columnName, order: 'asc' }],
						limit: 100,
					},
				},
			},
		})
		.then(
			(res) =>
				(columnValues.value[col.columnName] = res.data.map((item) => ({
					label: item[col.columnName],
					value: item[col.columnName],
				}))),
		)
}

const params = computed(() => {
	return useAppStore().params
})

const columnList = computed<Partial<FieldType>>(() => {
	return cloneDeep(columns.value).map((o) => {
		o.id = getId(6)
		o.valueType = 'value'
		o.andOr = 'and'
		o.operator = '='
		return o
	})
})

const hasFilter = computed(() => {
	return props.localTask.schema && props.localTask.schema.filter && props.localTask.schema.filter[0]
})

const changeFilter = (item) => {
	item.columnLength = columnList.value.find((o) => o.columnName === item.columnName).columnLength
	item.dataType = columnList.value.find((o) => o.columnName === item.columnName).dataType
}

const deleteFilter = (id) => {
	props.localTask.schema.filter[0].list = props.localTask.schema.filter[0].list.filter((o) => o.id !== id)
}

const operators = (item) => {
	let op = dataTypeName(item.dataType)
	if (op !== 'number' && op !== 'text') {
		op = 'date'
	}
	return (operatorsFilters[op].filter((o) => !['between', 'notBetween'].includes(o.operator)) || []).map((o) => {
		return {
			value: o.operator,
			label: t(o.name),
		}
	})
}

const addCol = () => {
	const lt = cloneDeep(props.localTask)
	lt.schema.filter[0].list.push({
		...columnList.value[0],
		valueType: 'value',
		andOr: 'and',
		operator: '=',
		id: getId(6),
	})

	props.localTask.schema.filter = cloneDeep(lt.schema.filter)
}

const loadColumnList = () => {
	const taskData = {
		...useAppStore().appInfo,
		tableName: props.tableName,
		sourceType: 'bucket',
		client: 'clickhouse',
	}

	useApi()
		.post('api/table/field', {
			body: {
				taskData,
			},
		})
		.then((res) => (columns.value = res.data))
}

onMounted(() => loadColumnList())
</script>
