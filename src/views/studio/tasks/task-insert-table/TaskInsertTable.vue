<template>
	<g-dialog @close="$emit('close')">
		<template #title>
			<task-icon :local-task="localTask" />
			{{ $t('taskInsertTable') }}
		</template>
		<template #content>
			<div class="task-insert-table size-full flex-col items-center justify-center">
				<div class="flex flex-col gap-2 overflow-auto">
					<div class="flex w-full flex-col gap-1">
						<label class="control-label">{{ $t('taskLabel') }}</label>
						<NInput
							id="task"
							v-model:value="localTask.label"
						/>
					</div>
					<div class="control-label rounded bg-paper-200 p-2 dark:bg-carbon-300">
						{{ $t('migrateDataByInsert') }}
					</div>
					<NCard content-style="padding: 10">
						<div class="flex items-center gap-2">
							<div class="grow">
								<div class="control-label">
									{{ $t('sourceTable') }}
								</div>
								<g-select-table
									v-model="localTask.tableName"
									:placeholder="$t('selectTable')"
									:disabled="true"
								/>
							</div>
							<div class="grow">
								<div class="control-label">{{ $t('targetTable') }}</div>
								<g-select-table
									v-model="localTask.resultTable"
									:placeholder="$t('selectTable')"
									@update:model-value="onChooseTable(localTask.resultTable, 'resultTable')"
								/>
							</div>
						</div>
					</NCard>

					<div
						v-if="showFinds()"
						class="flex items-center gap-2"
					>
						<NButton
							class="w-50 grow"
							type="primary"
							style="color: white"
							:disabled="showButtonAuto"
							@click="autoColumns()"
						>
							{{ $t('autoFill') }}
						</NButton>

						<NButton
							class="w-50 grow"
							style="color: black"
							:disabled="showButtonClean"
							@click="autoClean()"
						>
							{{ $t('clearFields') }}
						</NButton>
					</div>

					<NCard content-style="padding: 10px">
						<table
							v-if="columns.resultTable.length && columns.sourceTable.length"
							class="w-full table-auto"
						>
							<thead>
								<tr class="border-b text-left *:p-1 even:bg-paper-200">
									<th>
										{{ $t('sourceColumns') }}
									</th>
									<th>{{ $t('targetColumns') }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="item in columns.sourceTable"
									:key="item.columnName"
									class="border-b *:p-1 odd:bg-paper-200"
								>
									<td>
										<g-icon :name="dataTypeIcon(item.dataType)" />
										{{ item.columnName }}
									</td>
									<td>
										<NSelect
											:key="item.targetColumn"
											v-model:value="item.targetColumn"
											class="w-96"
											:placeholder="$t('selectColumn')"
											:filterable="true"
											value-field="columnName"
											label-field="columnName"
											:options="columns.resultTable"
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</NCard>
				</div>
				<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
					<NButton
						type="primary"
						:loading="loading"
						@click="save()"
					>
						{{ $t('save') }}
					</NButton>
				</div>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { FieldType, InsertTableTaskType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { onMounted, reactive, ref } from 'vue'

const { dataTypeIcon } = useDataType()

const emit = defineEmits(['close'])

const localTask = ref<InsertTableTaskType>()
const loading = ref(false)

const columns = reactive({
	resultTable: [] as FieldType[],
	sourceTable: [] as FieldType[]
})
let showButtonAuto = false
let showButtonClean = true

const autoColumns = () => {
	columns.sourceTable.forEach((o, sourceIndex) => {
		if (columns.resultTable[sourceIndex]) {
			o.targetColumn = columns.resultTable[sourceIndex].columnName
			showButtonAuto = true
			showButtonClean = false
		}
	})
}

const autoClean = () => {
	columns.sourceTable.forEach((o, sourceIndex) => {
		if (columns.resultTable[sourceIndex]) {
			o.targetColumn = undefined
			showButtonAuto = false
			showButtonClean = true
		}
	})
}

const save = () => {
	loading.value = true
	const taskToBeSaved = useDefault({
		type: 'insert',
		base: {
			...useAppStore().appInfo,
			...localTask.value
		}
	})

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
			sources: [
				useDefault({
					type: 'table',
					base: {
						...useAppStore().appInfo,
						...taskToBeSaved,
						label: taskToBeSaved.tableName,
						tableName: taskToBeSaved.tableName
					}
				})
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...taskToBeSaved,
						label: taskToBeSaved.resultTable,
						tableName: taskToBeSaved.resultTable
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

const showFinds = (): boolean => {
	if (columns.sourceTable.length > 0 && columns.resultTable.length > 0) {
		return true
	}
}

const onChooseTable = async (tableName, tableType) => {
	const taskData = cloneDeep(localTask.value)

	taskData.tableName = tableName
	taskData.temporary = false

	await useApi()
		.post('api/table/field', {
			body: {
				taskData
			}
		})
		.then((res) => [(columns[tableType] = res.data), prepareTableSchema()])
}

const prepareTableSchema = () => {
	if (columns.sourceTable && columns.resultTable) {
		localTask.value.schema = localTask.value.schema || defaultSchema
		localTask.value.schema.select.forEach((source, key) => {
			columns.sourceTable[key].targetColumn = source.targetColumn || 'none'
		})
	}
}

const reset = () => {
	onChooseTable(localTask.value.tableName, 'sourceTable')
	onChooseTable(localTask.value.resultTable, 'resultTable')
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'insert',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
	reset()
	if (localTask.value.id) {
		onChooseTable(localTask.value.resultTable, 'resultTable')
		showButtonClean = false
	}
})
</script>
