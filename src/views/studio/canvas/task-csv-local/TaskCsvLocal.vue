<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('taskLocalCsvFolder') }}</template>
		<template #content>
			<div class="canvas-task-local-body size-full flex-col items-center justify-center">
				<div class="flex flex-col items-center justify-center gap-1 overflow-auto bg-elevation-1 p-4">
					<div class="flex w-full justify-center gap-2">
						<div class="flex w-full flex-col gap-1">
							<label
								class="font-semibold text-neutral-500"
								for="task"
							>
								{{ $t('taskLabel') }}
							</label>
							<n-input
								id="task"
								v-model:value="localTask.label"
								:placeholder="$t('taskLocalCsvFolder')"
							/>
						</div>
						<div class="flex w-full flex-col gap-1">
							<label class="font-semibold text-neutral-500">{{ $t('resultTable') }}</label>
							<n-input
								v-model:value="localTask.resultTable"
								:placeholder="$t('tableName')"
							/>
						</div>
					</div>

					<div class="w-full">
						<label class="font-semibold text-neutral-500">{{ $t('separator') }}</label>
						<n-select
							v-model:value="localTask.fileFormatType"
							filterable
							:options="[
								{ value: 'TabSeparatedWithNames', label: $t('tab') },
								{ value: 'CSVWithNames', label: $t('comma') },
								{ value: '|', label: '|' },
								{ value: '||', label: '||' },
								{ value: ';', label: ';' }
							]"
						/>
					</div>

					<div class="w-full">
						<div class="control-label">{{ $t('options') }}</div>
						<n-select
							v-model:value="localTask.schemaInference"
							filterable
							:options="[
								{ value: 'schemaInference', label: $t('withSchemaInference') },
								{ value: 'noSchemaInference', label: $t('noSchemaInference') }
							]"
						/>
					</div>

					<div class="w-full">
						<label
							class="font-semibold text-neutral-500"
							for="folder"
						>
							{{ $t('folder') }}
						</label>
						<n-input
							id="folder"
							v-model:value="localTask.folderPath"
							placeholder=""
						/>
					</div>

					<div class="flex w-full flex-col">
						<n-checkbox
							v-model:checked="localTask.insertMode"
							:label="$t('insertMode')"
						/>
						<n-checkbox
							v-model:checked="localTask.deleteAfterImport"
							:label="$t('deleteAfterImport')"
						/>
					</div>
					<div class="flex w-full justify-center bg-elevation-1">
						<div class="flex grow bg-orange-100 p-2">
							<p class="text-xs text-orange-600">
								{{
									`${$t('csvLocalFolderPathInfo')}:
                                ~/content/app/app:${localTask.appId}/imports/${localTask.folderPath}`
								}}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<n-button
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
import { useAppStore } from '@/stores'
import type { LocalFileTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import { onBeforeMount, ref } from 'vue'

const loading = ref(false)
const emit = defineEmits(['close'])
const localTask = ref<LocalFileTaskType>()

const save = () => {
	loading.value = true
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value,
			sources: [],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...localTask.value,
						label: localTask.value.resultTable,
						tableName: localTask.value.resultTable,
						databaseName: getBucketNameFromAppId(localTask.value.appId)
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onBeforeMount(() => {
	localTask.value = useDefault({
		type: 'localCsv',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {})
		}
	})
})
</script>
