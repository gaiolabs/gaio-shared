<template>
	<div class="task-form-options-slider">
		<div class="control">
			<div class="control-label">{{ $t('type') }}</div>
			<n-select
				v-model:value="useFormStore().currentField.sliderType"
				filterable
				:options="[
					{
						value: 'number',
						label: $t('number')
					},
					{
						value: 'monthly',
						label: $t('monthly')
					}
				]"
				@update:value="organizeByType()"
			/>
		</div>

		<div class="control">
			<div class="control">
				<div class="control-label">{{ $t('min') }}</div>
				<n-input-number
					v-model:value="useFormStore().currentField.sliderMinValue"
					:disabled="useFormStore().currentField.sliderType === 'monthly'"
				/>
			</div>
			<div class="control">
				<div class="control-label">{{ $t('max') }}</div>
				<n-input-number
					v-model:value="useFormStore().currentField.sliderMaxValue"
					:disabled="useFormStore().currentField.sliderType === 'monthly'"
				/>
			</div>
			<div class="control">
				<div class="control-label">{{ $t('step') }}</div>
				<n-input-number
					v-model:value="useFormStore().currentField.sliderStepValue"
					:disabled="useFormStore().currentField.sliderType === 'monthly'"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores'
import { onMounted } from 'vue'

const organizeByType = () => {
	if (useFormStore().currentField.sliderType === 'monthly') {
		useFormStore().currentField.sliderMinValue = 1
		useFormStore().currentField.sliderMaxValue = 12
		useFormStore().currentField.sliderStepValue = 1
	}
}

onMounted(() => organizeByType())
</script>
