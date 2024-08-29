<template>
	<div class="task-form-options-general">
		<div class="control-secondary">
			<div v-if="['lineText', 'lineNumber'].includes(useFormStore().currentField.type)">
				<n-checkbox
					v-model:checked="useFormStore().currentField.hidden"
					:label="$t('hidden')"
				/>
			</div>
			<div>
				<n-checkbox
					v-model:checked="useFormStore().currentField.readonly"
					:label="$t('readonly')"
				/>
			</div>
			<div>
				<n-checkbox
					v-model:checked="useFormStore().currentField.required"
					:label="$t('required')"
				/>
			</div>
			<div>
				<n-checkbox
					v-model:checked="useFormStore().currentField.all"
					:label="$t('allPermitted')"
				/>
			</div>
			<div>
				<n-checkbox
					v-model:checked="useFormStore().currentField.longText"
					:label="$t('longText')"
				/>
			</div>
			<template v-if="useFormStore().currentField.longText">
				<div class="control">
					<label class="control-label">{{ $t('max') }}</label>
					<n-input-number v-model:value="useFormStore().currentField.max" />
				</div>
				<div class="control">
					<label class="control-label">{{ $t('rows') }}</label>
					<n-input-number v-model:value="useFormStore().currentField.textareaRows" />
				</div>
			</template>
			<div
				v-if="hasMultiple.includes(useFormStore().currentField.type)"
				class="clearfix"
			>
				<n-checkbox
					v-model:checked="useFormStore().currentField.multiple"
					:label="$t('multiple')"
				/>
			</div>
		</div>

		<div class="control-secondary mt-2">
			<div class="control">
				<label class="control-label">{{ $t('label') }}</label>
				<n-input v-model:value="useFormStore().currentField.label" />
			</div>
			<div class="control">
				<label class="control-label">{{ $t('placeholder') }}</label>
				<n-input v-model:value="useFormStore().currentField.placeholder" />
			</div>
			<div class="control">
				<label class="control-label">{{ $t('description') }}</label>
				<n-input
					v-model:value="useFormStore().currentField.placeholder"
					type="textarea"
				/>
			</div>
		</div>

		<div class="control-secondary mt-2">
			<div
				v-if="useFormStore().currentField.type === 'date'"
				class="control"
			>
				<n-checkbox
					v-model:checked="useFormStore().currentField.isRange"
					:label="$t('isRange')"
				/>
			</div>
			<div
				v-if="useFormStore().currentField.type === 'date'"
				class="control"
			>
				<div class="control-label">{{ $t('dateFormatType') }}</div>
				<n-select
					v-model:value="useFormStore().currentField.datePickerType"
					:options="[
						{ label: $t('date'), value: 'date' },
						{ label: $t('year'), value: 'year' },
						{ label: $t('month'), value: 'month' },
						{ label: $t('week'), value: 'week' }
					]"
				/>
			</div>
			<div class="control">
				<div class="control-label">{{ $t('dateLabelFormat') }}</div>
				<n-input
					v-model:value="useFormStore().currentField.labelFormat"
					@blur="useFormStore().refresh()"
				/>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useFormStore } from '@/stores'

const hasMultiple = ['select', 'checkbox']
</script>
