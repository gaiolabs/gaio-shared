<template>
	<g-dialog width="50%">
		<template #title>{{ $t('taskCreateTable') }}</template>
		<template #content>
			<div class="">
				<div class="flex items-center gap-2 overflow-auto bg-elevation-1">
					<div class="grow">
						<label
							class="font-semibold text-neutral-500"
							for="task"
						>
							{{ $t('task') }}
						</label>
						<NInput
							v-model:value="localTask.label"
							:placeholder="$t('taskLabel')"
						/>
					</div>
					<div class="grow">
						<label
							class="font-semibold text-neutral-500"
							for="task"
						>
							{{ $t('resultTable') }}
						</label>
						<NInput
							v-model:value="localTask.resultTable"
							:placeholder="$t('resultTable')"
						/>
					</div>
				</div>
				<div class="mx-3 mb-3">
					<NCard content-style="padding: 10px">
						<div class="relative overflow-x-auto">
							<table class="w-full table-auto">
								<thead>
									<tr class="vertical-mid text-left *:p-1">
										<th class="w-[25px]"></th>
										<th class="w-[25px]"></th>
										<th>{{ $t('column') }}</th>
										<th>{{ $t('type') }}</th>
										<th>{{ $t('default') }}</th>
										<th class="w-[25px]">
											<NButton
												type="info"
												size="tiny"
												secondary
											>
												<template #icon>
													<g-icon name="plus" />
												</template>
											</NButton>
										</th>
									</tr>
								</thead>
								<drag
									v-model="localTask.columns"
									tag="tbody"
									:list="localTask.columns"
									item-key="id"
									handle=".handle"
								>
									<tr
										v-for="col of localTask.columns"
										:key="col.id"
										class="tr-item border-b *:p-1 odd:bg-paper-200"
									>
										<td class="w-[25px]">
											<g-icon
												name="handle"
												class="handle"
											/>
										</td>
										<td class="w-[25px]">
											<g-icon :name="dataTypeIcon(col.dataType)" />
										</td>
										<td class="grow">
											<NInput
												v-model:value="col.columnName"
												:placeholder="$t('default')"
											/>
										</td>
										<td class="grow">
											<div class="flex gap-2">
												<div class="grow">
													<NSelect
														:key="col.id"
														v-model:value="col.dataType"
														filterable
														:options="typeOptions"
													/>
												</div>
												<div
													v-if="col.dataType === 'Nullable(Float64)'"
													class="w-100"
												>
													<NInputNumber
														v-model:value="col.columnLength"
														class="w-100"
														:placeholder="$t('decimal')"
														:step="1"
														:max="6"
														:min="1"
													/>
												</div>
												<div
													v-if="col.dataType === 'Nullable(Array)'"
													class="w-100"
												>
													<NSelect
														v-model:value="col.arrayDataType"
														class="w-100"
														:options="[
															{
																label: $t('numeric'),
																value: 'Numeric'
															},
															{
																label: $t('string'),
																value: 'String'
															}
														]"
													/>
												</div>
											</div>
										</td>
										<td class="grow">
											<NInput
												v-model:value="col.default"
												:placeholder="$t('default')"
											/>
										</td>
										<td class="w-[25px]">
											<NButton
												type="error"
												size="tiny"
												secondary
											>
												<template #icon>
													<g-icon name="delete" />
												</template>
											</NButton>
										</td>
									</tr>
								</drag>
							</table>
						</div>
					</NCard>
				</div>
			</div>
			<div class="flex-between flex bg-paper-100 px-4 py-2">
				<div>
					<NCheckbox
						v-model:checked="localTask.dropTable"
						:placeholder="$t('dropTable')"
						:label="$t('dropTable')"
					/>
				</div>
				<div>
					<NButton
						type="primary"
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
import useDataType from '@/composables/useDataType'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { CreateTableTaskType } from '@gaio/shared/types/tasks/create-table.task.type'
import { onMounted, ref } from 'vue'
import { VueDraggableNext as Drag } from 'vue-draggable-next'

const emit = defineEmits(['close'])
const { dataTypeIcon } = useDataType()

const localTask = ref<CreateTableTaskType>()
const typeOptions = [
	{ label: 'String', value: 'Nullable(String)' },
	{
		label: 'Int64',
		value: 'Nullable(Int64)'
	},
	{ label: 'Float64', value: 'Nullable(Float64)' },
	{ label: 'Date', value: 'Nullable(Date)' },
	{
		label: 'DateTime',
		value: 'Nullable(DateTime)'
	},
	{ label: 'Array', value: 'Nullable(Array)' }
]

// console.log('name', name)

// const flowListOptions = computed(() => {
//     return useAppStore().flowList.map((item) => {
//         return {
//             label: item.flowName,
//             value: item.flowId
//         }
//     })
// })
//
// const router = useRouter()

// const addColumn = () => {
//     localTask.value.columns.push({
//         columnName: `col_${localTask.value.columns.length + 1}`,
//         dataType: 'Nullable(String)',
//         default: ''
//     })
// }

const save = () => {
	const taskToBeSaved = useDefault({
		type: 'create',
		base: {
			...useAppStore().appInfo,
			...localTask.value
		}
	})

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
			sources: [],
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

const prepareLocalTask = () => {
	localTask.value = useDefault({
		type: 'create',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
}

onMounted(() => prepareLocalTask())
</script>
