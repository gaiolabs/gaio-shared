<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('taskTableToParam') }}</template>
		<template #content>
			<div class="task-param-to-table overflow-auto">
				<div class="control">
					<div class="control-label">{{ $t('taskLabel') }}</div>
					<n-input v-model:value="localTask.label" />
				</div>
				<div class="control">
					<div class="control-label">{{ $t('resultTable') }}</div>
					<n-input
						v-model:value="localTask.resultTable"
						v-alpha
					>
						<template #prefix>
							<div>
								<g-icon
									name="clock"
									:color="localTask?.resultTable?.startsWith('tmp_') ? '#E32' : ''"
									:height="14"
								/>
							</div>
						</template>
					</n-input>
				</div>
				<div class="control">
					<div class="control-label">{{ $t('params') }}</div>
					<n-card content-style="padding: 10px">
						<n-input
							v-model:value="searchParam"
							class="w-100 mb-2"
							type="text"
							:placeholder="$t('filter')"
						/>
						<n-checkbox-group v-model:value="localTask.params">
							<table class="w-full table-auto">
								<tbody>
									<tr
										v-for="item in filteredParams"
										:key="item.paramName"
										class="tr-item border-b *:p-1 odd:bg-paper-200"
									>
										<td>
											<n-checkbox
												:value="item.paramName"
												:label="item.paramName"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</n-checkbox-group>
					</n-card>
				</div>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<n-button
					:loading="loading"
					type="primary"
					@click="save()"
				>
					{{ $t('save') }}
				</n-button>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { ParamToTableTaskType } from '@gaio/shared/types'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['close'])
const localTask = ref<ParamToTableTaskType>()

const searchParam = ref('')
const loading = ref(false)
const { filterBy } = useHelper()

const filteredParams = computed(() => {
	return filterBy(useAppStore().params, 'paramName', searchParam.value)
})

const save = () => {
	loading.value = true
	const taskToBeSaved = useDefault({
		type: 'paramToTable',
		base: {
			...useAppStore().appInfo,
			...localTask.value
		}
	})

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
			targets: [
				useDefault({
					type: 'table',
					base: {
						...useAppStore().appInfo,
						...taskToBeSaved,
						tableName: localTask.value.resultTable,
						label: localTask.value.resultTable
					}
				})
			],
			sources: []
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'paramToTable',
		base: {
			...(useAppStore().appInfo || {}),
			...(useAppStore().cloneTask() || {})
		}
	})

	console.log('localTask', localTask.value)
})
</script>
