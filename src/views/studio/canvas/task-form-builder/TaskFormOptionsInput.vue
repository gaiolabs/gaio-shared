<template>
	<div class="task-form-options-input control-secondary">
		<div
			v-if="useFormStore().currentField.type !== 'slider'"
			class="control"
		>
			<div class="control-label">
				{{ $t('fieldDataSource') }}
			</div>
			<n-select
				v-model:value="useFormStore().currentField.source"
				class="w-full"
				:options="[
					{
						label: $t('formStaticValue'),
						value: 'static',
						disabled: !isInput.includes(useFormStore().currentField.type)
					},
					{
						label: $t('formListValue'),
						value: 'list',
						disabled: !isList.includes(useFormStore().currentField.type)
					},
					{
						label: $t('formBucketValue'),
						value: 'bucket',
						disabled: !isList.includes(useFormStore().currentField.type)
					}
				]"
			/>
		</div>
		<!-- TYPES -->
		<div class="task-form-options-list">
			<div class="control param-values">
				<!--SOURCE::SLIDER -->
				<div v-if="useFormStore().currentField.type === 'slider'">
					<task-form-options-slider />
				</div>
				<!--SOURCE::TABLE -->
				<template v-else-if="useFormStore().currentField.source === 'list'">
					<task-form-options-list-table />
				</template>
				<!--SOURCE::BUCKET -->
				<template v-else-if="useFormStore().currentField.source === 'bucket'">
					<task-form-options-list-bucket />
				</template>
				<template v-if="['checkbox', 'radio'].includes(useFormStore().currentField.type)">
					<div class="mt-2">
						<n-checkbox
							v-model:checked="useFormStore().currentField.isButton"
							:label="$t('isButton')"
						/>
					</div>
					<div
						v-if="
							useFormStore().currentField.type === 'checkbox' ||
							(useFormStore().currentField.type === 'radio' && !useFormStore().currentField.isButton)
						"
						class="mt-2"
					>
						<n-checkbox
							v-model:checked="useFormStore().currentField.isVertical"
							:label="$t('isVertical')"
						/>
					</div>
				</template>
				<!-- FORCE NUMBER VALUES-->
				<div class="mt-2">
					<n-checkbox
						v-model:checked="useFormStore().currentField.valueIsNumber"
						:label="$t('parseValueAsNumber')"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores'
import TaskFormOptionsListBucket from '@/views/studio/canvas/task-form-builder/TaskFormOptionsListBucket.vue'
import TaskFormOptionsListTable from '@/views/studio/canvas/task-form-builder/TaskFormOptionsListTable.vue'
import TaskFormOptionsSlider from '@/views/studio/canvas/task-form-builder/TaskFormOptionsSlider.vue'

const isInput = ['lineText', 'lineNumber', 'date', 'date', 'datetime', 'time']
const isList = ['radio', 'select', 'checkbox', 'slider']
</script>
