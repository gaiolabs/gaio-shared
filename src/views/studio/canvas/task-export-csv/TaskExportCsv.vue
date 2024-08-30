<template>
	<g-dialog
		width="600px"
		@close="$emit('close')"
	>
		<template #title>
			<task-icon :local-task="localTask" />
			{{ $t('taskExportFile') }}
		</template>
		<template #content>
			<div class="canvas-task-local-body size-full flex-col items-center justify-center">
				<div class="flex flex-col items-center justify-center gap-1 overflow-auto bg-elevation-1">
					<div class="flex w-full justify-center gap-2">
						<div class="flex w-full flex-col gap-1">
							<label
								class="font-semibold text-neutral-500"
								for="task"
							>
								{{ $t('taskLabel') }}
							</label>
							<NInput
								id="task"
								v-model:value="localTask.label"
								:placeholder="$t('taskLocalCsvFolder')"
							/>
						</div>
					</div>
					<div class="flex w-full flex-col gap-2">
						<div class="w-full">
							<label class="font-semibold text-neutral-500">{{ $t('separator') }}</label>
							<NSelect
								v-model:value="localTask.separator"
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
						<div class="flex w-full items-center gap-2">
							<NCheckbox
								v-model:checked="localTask.compress"
								:label="$t('compressFile')"
							/>
						</div>
						<div class="bg-blue-100 px-4 py-2">
							<span class="text-sm text-gray-400">{{ $t('compressFileInfo') }}</span>
						</div>
					</div>
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
import type { ExportToFileType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const loading = ref(false)
const emit = defineEmits(['close'])
const localTask = ref<ExportToFileType>()

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
			targets: []
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'export',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {})
		}
	})
	console.log(localTask.value)
})
</script>
