<template>
	<g-dialog @close="$emit('close')">
		<template #title>{{ $t('googleSpreadsheet') }}</template>
		<template #content>
			<div class="task-google-spreadsheet size-full flex-col items-center justify-center">
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
								id="task"
								v-model:value="localTask.label"
								name="task"
								:placeholder="$t('taskLabel')"
							/>
						</div>
						<div class="flex w-full flex-col gap-1">
							<label
								class="font-semibold text-neutral-500"
								for="resultTable"
							>
								{{ $t('resultTable') }}
							</label>
							<NInput
								id="resultTable"
								v-model:value="localTask.resultTable"
								:placeholder="$t('resultTable')"
							/>
						</div>
					</div>
					<div class="flex w-full flex-col gap-1">
						<label
							class="font-semibold text-neutral-500"
							for="spreadsheetDocId"
						>
							Spreadsheet DOC ID
						</label>
						<NInput
							id="spreadsheetDocId"
							v-model:value="localTask.url"
							:placeholder="''"
						/>
					</div>
					<div class="flex w-full flex-col gap-1">
						<NCheckbox v-model:checked="localTask.insertMode">
							Insertion Mode. If the table already exists, won't be replaced. New values willb added to the table
						</NCheckbox>
					</div>
				</div>
				<div class="flex justify-end bg-elevation-0 px-4 py-2">
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
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { GoogleSpreadsheetTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close'])

const localTask = ref<GoogleSpreadsheetTaskType>()

const save = async (): Promise<void> => {
	const taskToBeSaved = useDefault({
		type: 'googleSpreadsheet',
		base: {
			...useAppStore().appInfo,
			...localTask.value
		}
	})

	await useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
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
onMounted(() => {
	console.log('casa')
	localTask.value = useDefault({
		type: 'googleSpreadsheet',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {})
		}
	})
})
</script>
