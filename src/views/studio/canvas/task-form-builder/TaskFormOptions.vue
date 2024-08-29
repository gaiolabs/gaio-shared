<template>
	<div class="task-form-options h-full p-2">
		<div class="g-bg-100 h-full p-2">
			<template v-if="useFormStore().currentField">
				<div class="p-1">
					<div class="flex items-center gap-1">
						<g-icon :name="useFormStore().currentField.type" />
						{{ $t(useFormStore().currentField.type) }}
					</div>
					<n-divider />
				</div>
				<!--PARAMETER-->
				<div class="control g-bg-1 rounded border p-2">
					<div class="control-label">
						{{ $t('parameter') }}
					</div>
					<g-select-param v-model="useFormStore().currentField.paramName" />
					<template v-if="useFormStore().currentField.type === 'slider'">
						<div class="control-label">
							{{ $t('extraParam') }}
						</div>
						<g-select-param v-model="useFormStore().currentField.extraParamName" />
					</template>
				</div>
				<!--ALERT-->
				<template v-if="!paramDefined">
					<g-alert
						show-icon
						:title="$t('formFieldParamRequired')"
					/>
				</template>
				<!--PARAM DEFINED-->
				<template v-if="paramDefined && !isInput.includes(useFormStore().currentField.type)">
					<div class="task-form-options">
						<div class="h-full rounded bg-paper-100 dark:bg-carbon-100">
							<n-tabs
								type="segment"
								animated
								size="small"
							>
								<n-tab-pane
									name="settings"
									:tab="$t('settings')"
								>
									<task-form-options-input class="mt-2" />
								</n-tab-pane>
								<n-tab-pane
									name="general"
									:tab="$t('general')"
								>
									<task-form-options-general class="mt-2" />
								</n-tab-pane>
							</n-tabs>
						</div>
					</div>
				</template>
				<template v-else-if="paramDefined">
					<task-form-options-general class="mt-2" />
				</template>
			</template>
		</div>
	</div>
</template>
<script setup lang="ts">
import GSelectParam from '@/components/GSelectParam.vue'
import { useFormStore } from '@/stores'
import TaskFormOptionsGeneral from '@/views/studio/canvas/task-form-builder/TaskFormOptionsGeneral.vue'
import TaskFormOptionsInput from '@/views/studio/canvas/task-form-builder/TaskFormOptionsInput.vue'
import { computed } from 'vue'

const isInput = ['lineText', 'lineNumber', 'date', 'date', 'datetime', 'time']
const paramDefined = computed(() => {
	return (
		useFormStore().currentField.paramName &&
		(useFormStore().currentField.type === 'slider' ? !!useFormStore().currentField.extraParamName : true)
	)
})
//
// watch(
//     () => computed(() => useFormStore().currentField).value,
//     debounce((field) => {
//         console.log(field)
//         useFormStore().updateFieldById(field.id)
//         console.log('fsafda')
//     }, 600), // Adjust the time as necessary
//     { deep: true }
// )
</script>
