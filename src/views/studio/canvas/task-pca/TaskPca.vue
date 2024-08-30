<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>
			<task-icon :local-task="localTask" />
			{{ $t('taskPca') }}
		</template>
		<template #content>
			<div class="canvas-task-pca overflow-auto">
				<div class="control">
					<div class="control-label">
						{{ $t('taskLabel') }}
					</div>
					<n-input v-model:value="localTask.label" />
				</div>
				<div class="flex items-center gap-2">
					<div class="control grow">
						<div class="control-label">
							{{ $t('sourceTable') }}
						</div>
						<n-input
							v-model:value="localTask.tableName"
							disabled
							class="w-100"
						/>
					</div>
					<div class="control grow">
						<div class="control-label">
							{{ $t('resultTable') }}
						</div>
						<n-input
							v-model:value="localTask.resultTable"
							v-alpha
						/>
					</div>
				</div>
				<n-card
					content-style="padding: 10px"
					class="mb-2"
				>
					<div class="control control-secondary">
						<div class="control-label">{{ $t('qtdComponents') }}</div>
						<n-input-number
							v-model:value="localTask.k"
							requeried
							:min="1"
							:max="20"
							:step="1"
						/>
					</div>
					<div class="control">
						<div class="control-label">
							{{ $t('excludeColumns') }}
						</div>
						<g-select-column
							v-model:value="localTask.excludeColumns"
							:table-name="localTask.tableName"
							multiple
						/>
					</div>
				</n-card>
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
import type { PcaTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])
const loading = ref(false)
const localTask = ref<PcaTaskType>({})

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
		type: 'pca',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
	console.log('mounted')
})
</script>
