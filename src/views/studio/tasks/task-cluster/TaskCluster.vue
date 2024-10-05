<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('taskCluster') }}</template>
		<template #content>
			<div class="task-cluster overflow-auto">
				<div class="control">
					<div class="control-label">
						{{ $t('taskLabel') }}
					</div>
					<NInput v-model:value="localTask.label" />
				</div>
				<div class="mb-2 flex gap-2">
					<div class="control grow">
						<div class="control-label">
							{{ $t('resultTable') }}
						</div>
						<NInput
							v-model:value="localTask.resultTable"
							v-alpha
						/>
					</div>

					<div class="control grow">
						<div class="control-label">
							{{ $t('tableName') }}
						</div>
						<NInput
							v-model:value="localTask.tableName"
							disabled
							class="w-100"
						/>
					</div>
				</div>
				<NCard content-style="padding: 10px">
					<div class="control">
						<div class="control-label">
							{{ $t('excludeColumns') }}
						</div>
						<g-select-column
							v-model="localTask.excludeColumns"
							:table-name="localTask.tableName"
							multiple
						/>
					</div>
					<div class="control">
						<div class="control-label">
							{{ $t('executionTime') }}
						</div>
						<NInputNumber
							v-model:value="localTask.executionTime"
							required
							class="w-100"
							:min="5"
							:step="1"
						/>
					</div>
					<div class="control control-top">
						<div class="flex items-center gap-2">
							<NSwitch
								v-model:value="localTask.estimateK"
								:round="false"
								size="small"
							/>
							<div>
								{{ $t('estimateKSize') }}
							</div>
						</div>
					</div>
					<div
						v-if="!localTask.estimateK"
						class="control control-secondary"
					>
						<div class="control-label">
							{{ $t('maxClusterSize') }}
						</div>
						<NInputNumber
							v-model:value="localTask.clusterSize"
							class="w-100"
							requeried
							:min="1"
							:step="1"
						/>
					</div>
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
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { ClusterTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close'])
const loading = ref(false)
const localTask = ref<ClusterTaskType>()

const save = async () => {
	loading.value = true

	const taskToBeSaved = useDefault({
		type: 'cluster',
		base: {
			...useAppStore().appInfo,
			...localTask.value
		}
	})

	await useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
			sources: [
				useDefault({
					type: 'table',
					base: taskToBeSaved
				})
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...taskToBeSaved,
						tableName: taskToBeSaved.resultTable
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'cluster',
		base: useAppStore().cloneTask()
	})
})
</script>
