<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>
			<task-icon :local-task="localTask" />
			{{ $t('taskTimeSeries') }}
		</template>
		<template #content>
			<div class="task-forecast size-full flex-col items-center justify-center">
				<div class="flex flex-col items-center justify-center gap-1 overflow-auto">
					<div class="flex w-full justify-center gap-2">
						<div class="flex w-full flex-col gap-1">
							<label
								class="control-label"
								for="task"
							>
								{{ $t('taskLabel') }}
							</label>
							<NInput v-model:value="localTask.label" />
						</div>
					</div>
					<div class="flex w-full items-center gap-2">
						<div class="control grow">
							<label class="control-label">
								{{ $t('sourceTable') }}
							</label>
							<NInput
								v-model:value="localTask.tableName"
								disabled
								class="w-100"
							/>
						</div>
						<div class="control grow">
							<label class="control-label">
								{{ $t('resultTable') }}
							</label>
							<NInput
								v-model:value="localTask.resultTable"
								v-alpha
							/>
						</div>
					</div>
					<div class="mb-2 w-full space-y-2 rounded-md bg-white p-4 px-2.5">
						<div class="flex items-center gap-2">
							<div class="flex w-full flex-col gap-1">
								<label
									class="control-label"
									for="date"
								>
									{{ $t('date') }}
								</label>
								<g-select-column
									id="date"
									v-model="localTask.columnDate"
									:table-name="localTask.tableName"
								/>
							</div>
							<div class="flex w-full flex-col gap-1">
								<label
									class="control-label"
									for="measure"
								>
									{{ $t('measure') }}
								</label>
								<g-select-column
									id="measure"
									v-model="localTask.columnMeasure"
									:table-name="localTask.tableName"
								/>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<div class="flex w-full flex-col gap-1">
								<label
									class="control-label"
									for="frequency"
								>
									{{ $t('frequency') }}
								</label>
								<NSelect
									id="frequency"
									v-model:value="localTask.freq"
									:options="[
										{
											label: $t('monthly'),
											value: 'monthly'
										},
										{
											label: $t('daily'),
											value: 'daily'
										}
									]"
								/>
							</div>
							<div class="flex w-full flex-col gap-1">
								<label
									class="control-label"
									for="periods"
								>
									{{ $t('periods') }}
								</label>
								<NInputNumber
									id="periods"
									v-model:value="localTask.periods"
									required
									:min="6"
									:max="100"
									:step="1"
								/>
							</div>
						</div>
					</div>
					<div class="flex w-full flex-col gap-1">
						<label
							class="control-label"
							for="metricsTable"
						>
							{{ $t('metricsTable') }}
						</label>
						<NInput
							id="metricsTable"
							v-model:value="localTask.resultMetricTable"
							v-alpha
						/>
					</div>
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
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { ForecastTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])
const loading = ref(false)
const localTask = ref<ForecastTaskType>({})

const save = () => {
	loading.value = true

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value,
			sources: [
				useDefault({
					type: 'table',
					base: localTask.value
				})
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...localTask.value,
						tableName: localTask.value.resultTable,
						databaseName: getBucketNameFromAppId(localTask.value.appId)
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'timeseries',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
	console.log('mounted')
})
</script>
