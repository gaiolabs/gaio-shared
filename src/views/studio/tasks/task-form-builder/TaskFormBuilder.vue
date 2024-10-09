<template>
	<div
		v-if="useFormStore().current"
		class="task-form-builder h-full"
	>
		<DrawerView
			tag="task-form-builder"
			class="task-form-builder"
			@close="$emit('close')"
		>
			<template #header>
				<div class="flex w-full justify-between">
					<div class="flex items-center gap-2">
						<task-icon
							:local-task="useFormStore().current"
							class="ms-2 size-[18px]"
						/>
						<NInput v-model:value="useFormStore().current.formName" />
					</div>
					<div class="flex items-center gap-2">
						<NButton size="small">
							<template #icon>
								<g-icon name="refresh" />
							</template>
							{{ $t('refresh') }}
						</NButton>
						<NButton
							size="small"
							type="primary"
							@click="save()"
						>
							{{ $t('save') }}
						</NButton>
						<NDivider vertical />
					</div>
				</div>
			</template>
			<template #content>
				<div class="flex h-full">
					<splitpanes>
						<pane :size="22">
							<task-form-setup />
						</pane>
						<pane>
							<task-form-preview :size="56" />
						</pane>
						<pane :size="22">
							<task-form-options />
						</pane>
					</splitpanes>
				</div>
			</template>
		</DrawerView>
	</div>
</template>
<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'

import useDefaultForm from '@/composables/useDefaultForm'
import { useAppStore, useFormStore } from '@/stores'
import TaskFormOptions from '@/views/studio/tasks/task-form-builder/TaskFormOptions.vue'
import TaskFormPreview from '@/views/studio/tasks/task-form-builder/TaskFormPreview.vue'
import TaskFormSetup from '@/views/studio/tasks/task-form-builder/TaskFormSetup.vue'
import { Pane, Splitpanes } from 'splitpanes'
import { onMounted } from 'vue'

defineEmits(['close'])

const save = () => {
	const formIndex = useAppStore().forms.findIndex((form) => form.formId === useFormStore().current.formId)

	if (formIndex > -1) {
		useAppStore().forms[formIndex] = useFormStore().current
	} else {
		useAppStore().forms.push(useFormStore().current)
	}
	useAppStore().saveAppMetadata('forms')
}

const selectFirstField = () => {
	useFormStore().currentField =
		useFormStore().current.formElements[0].cols[Object.keys(useFormStore().current.formElements[0].cols)[0]][0]
}

onMounted(() => {
	useFormStore().current = useDefaultForm(useFormStore().current)
	selectFirstField()
})
</script>
