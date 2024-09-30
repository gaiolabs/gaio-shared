<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('taskCsvWeb') }}</template>
		<template #content>
			<div
				v-if="localTask"
				class="canvas-task-url-body overflow-auto"
			>
				<div class="flex items-center gap-2">
					<div class="control grow">
						<div class="control-label">{{ $t('taskLabel') }}</div>
						<NInput v-model:value="localTask.label" />
					</div>
					<div class="control grow">
						<div class="control-label">{{ $t('resultTable') }}</div>
						<NInput
							v-model:value="localTask.resultTable"
							:placeholder="$t('tableName')"
						/>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<div class="control grow">
						<div class="control-label">
							{{ $t('fileUrl') }}
						</div>
						<NInput
							v-model:value="localTask.url"
							:placeholder="$t('paramsApplicable')"
						/>
					</div>
				</div>

				<div class="control grow">
					<div class="control-label">{{ $t('fieldsTerminatedBy') }}</div>
					<NSelect
						v-model:value="localTask.fileFormatType"
						filterable
						:options="[
							{ value: 'TabSeparatedWithNames', label: $t('tab') },
							{ value: 'CSVWithNames', label: $t('comma') },
							{ value: '|', label: '|' },
							{ value: '||', label: '||' },
							{ value: ';', label: ';' },
						]"
					/>
				</div>

				<div class="control grow">
					<div class="control-label">{{ $t('options') }}</div>
					<NSelect
						v-model:value="localTask.schemaInference"
						filterable
						:options="[
							{ value: 'schemaInference', label: $t('withSchemaInference') },
							{ value: 'noSchemaInference', label: $t('noSchemaInference') },
						]"
					/>
				</div>

				<div class="control">
					<NCheckbox
						v-model:checked="localTask.insertMode"
						:label="$t('insertMode')"
					/>
				</div>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<NButton
					type="primary"
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
import type { CsvUrlTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const loading = ref(false)
const emit = defineEmits(['close'])
const localTask = ref<CsvUrlTaskType>()

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
						resultTable: localTask.value.resultTable,
					},
				}),
			],
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'csvUrl',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {}),
		},
	})
})
</script>
