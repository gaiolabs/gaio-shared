<template>
	<div class="task-pivot flex size-full items-center justify-center">
		<g-dialog @close="$emit('close')">
			<template #title>{{ $t('pivotTable') }}</template>
			<template #content>
				<div
					v-if="localTask"
					class="flex flex-col items-center justify-center gap-1 overflow-auto"
				>
					<div class="flex w-full gap-2">
						<div class="flex w-full flex-col gap-1">
							<label
								class="font-semibold text-neutral-500"
								for="task"
							>
								{{ $t('task') }}
							</label>

							<NInput
								v-model:value="localTask.label"
								name="task"
								:placeholder="$t('taskLabel')"
							/>
						</div>
						<div class="flex w-full flex-col gap-1">
							<label class="font-semibold text-neutral-500">
								{{ $t('resultTable') }}
							</label>
							<NInput
								v-model:value="localTask.resultTable"
								v-alpha
								:placeholder="$t('selectTable')"
							>
								<template #prefix>
									<NTooltip
										:arrow-style="{ background: 'white' }"
										:style="{ background: 'white', color: 'black', maxWidth: '300px' }"
										trigger="hover"
									>
										<template #trigger>
											<g-icon
												name="clock"
												:color="localTask?.resultTable?.startsWith('tmp_') ? '#E32' : ''"
												:height="14"
											/>
										</template>
										<template #header>
											<strong>{{ $t('temporaryTable') }}</strong>
										</template>
										<template #default>
											<span v-html="$t('temporaryTableInfo')"></span>
										</template>
									</NTooltip>
								</template>
							</NInput>
							<small>{{ $t('sourceTable') }}: {{ localTask.tableName }}</small>
						</div>
					</div>

					<div class="mt-2 flex w-full justify-between gap-2">
						<div class="w-full">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotColumn') }}
							</label>
							<g-select-column
								v-model="localTask.transposeColumn"
								:table-name="localTask?.tableName"
								@update:model-value="listColumnValuesToTranspose"
							/>
						</div>
						<div class="w-full">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotSort') }}
							</label>
							<NSelect
								v-model:value="localTask.order"
								size="small"
								:options="[
									{
										label: $t('none'),
										value: '',
									},
									{
										label: $t('ascending'),
										value: 'ASC',
									},
									{
										label: $t('descending'),
										value: 'DESC',
									},
								]"
							/>
						</div>
					</div>

					<NCard
						v-if="localTask?.columns?.length > 0"
						content-style="padding: 0"
						class="mt-1"
					>
						<div class="flex justify-between border-b bg-paper-300 p-1 font-semibold">
							<div class="font-semibold text-neutral-500">
								{{ $t('columnsValuesToPivot') }}
							</div>
							<div>
								<NButton
									type="info"
									size="tiny"
									secondary
									@click="loadColumns"
								>
									<template #icon>
										<g-icon name="refresh" />
									</template>
								</NButton>
							</div>
						</div>
						<div class="relative overflow-x-auto p-2">
							<table class="w-full table-auto">
								<thead>
									<tr class="vertical-mid text-left font-semibold text-neutral-500">
										<th>{{ $t('columnName') }}</th>
										<th>{{ $t('transposeName') }}</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="col of localTask.columns"
										:key="col.id"
										class="border-b *:p-1 odd:bg-paper-200"
									>
										<td>
											{{ col.columnName }}
										</td>
										<td>
											<NInput
												v-model:value="col.transposeName"
												:placeholder="$t('value')"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</NCard>

					<div class="flex w-full gap-2">
						<div class="w-full">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotValue') }}
							</label>
							<g-select-column
								v-model="localTask.transposeColumnValue"
								:table-name="localTask?.tableName"
							/>
						</div>
						<div class="w-full">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotAggregation') }}
							</label>
							<NSelect
								v-model:value="localTask.transposeAggregator"
								:options="[
									{
										label: $t('none'),
										value: '',
									},
									{
										label: $t('sum'),
										value: 'SUM',
									},
									{
										label: $t('count'),
										value: 'count',
									},
									{
										label: $t('average'),
										value: 'AVG',
									},
									{
										label: $t('min'),
										value: 'MIN',
									},
									{
										label: $t('max'),
										value: 'MAX',
									},
								]"
							/>
						</div>
					</div>
					<div class="my-2 h-[1px] w-full bg-neutral-300" />
					<div class="flex w-full gap-2">
						<div class="flex w-full flex-col items-start justify-start gap-1">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotExtraColumns') }}
							</label>
							<g-select-column
								v-model:value="localTask.extraFields"
								:table-name="localTask?.tableName"
								multiple
							/>
						</div>
						<div class="flex w-full flex-col items-start justify-start gap-1">
							<label class="font-semibold text-neutral-500">
								{{ $t('pivotExtraColumnsPosition') }}
							</label>
							<NSelect
								v-model:value="localTask.extraFieldsPosition"
								:options="[
									{
										label: $t('atStart'),
										value: 'start',
									},
									{
										label: $t('atEnd'),
										value: 'end',
									},
								]"
							/>
						</div>
					</div>
				</div>
				<div class="flex justify-end bg-elevation-0 px-4 py-2">
					<NButton
						type="primary"
						:disabled="localTask?.tableName ? hasAllFieldsFulfilled : false"
						@click="save()"
					>
						{{ $t('save') }}
					</NButton>
				</div>
			</template>
		</g-dialog>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { FieldType, SchemaSortType, SchemaType } from '@gaio/shared/types'
import type { PivotTaskType } from '@gaio/shared/types/tasks/pivot.task.type'
import { getId } from '@gaio/shared/utils'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['close'])

const localTask = ref<PivotTaskType>()

const hasAllFieldsFulfilled = computed(() => {
	return !(
		(
			localTask.value.transposeAggregator &&
			localTask.value.transposeColumn &&
			localTask.value.transposeColumnValue &&
			localTask.value.resultTable
		) //&&
		// localTask.value.order
	)
})

const loadColumns = () => {
	const schema: Partial<SchemaType> = {
		limit: 100,
		select: [
			{
				id: getId(6),
				type: 'value',
				alias: 'columnName',
				dataType: 'Nullable(String)',
				distinct: true,
				tableName: localTask.value.tableName,
				columnName: localTask.value.transposeColumn,
				columnLength: null,
				databaseName: localTask.value.databaseName,
			},
		],
		sort: [
			{
				order: localTask.value.order,
				type: 'value',
				columnName: localTask.value.transposeColumn,
				tableName: localTask.value.tableName,
				databaseName: localTask.value.databaseName,
			} as SchemaSortType,
		],
	}

	useApi()
		.post('api/table/rows', {
			body: {
				taskData: {
					...useAppStore().appInfo,
					...localTask.value,
					type: 'table',
					schema,
				},
				params: [],
			},
		})
		.then((res) => {
			localTask.value.columns = res.data.map((col: FieldType) => {
				return {
					id: getId(6),
					[localTask.value.transposeColumn]: col.columnName,
					columnName: col.columnName,
					transposeName: useHelper().alpha(col.columnName),
				}
			})
		})
}

const listColumnValuesToTranspose = () => {
	if (!localTask.value.id) return
	loadColumns()
}

const save = () => {
	const taskToBeSaved = useDefault({
		type: 'pivot',
		base: {
			...useAppStore().appInfo,
			...localTask.value,
		},
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
						tableName: taskToBeSaved.tableName,
						label: taskToBeSaved.tableName,
					},
				}),
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...taskToBeSaved,
						label: taskToBeSaved.resultTable,
						tableName: taskToBeSaved.resultTable,
					},
				}),
			],
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useAppStore().cloneTask()
})
</script>
