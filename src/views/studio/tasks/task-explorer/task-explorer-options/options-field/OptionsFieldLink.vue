<template>
	<div class="options-field-link control-secondary">
		<div class="control">
			<div class="control-label">{{ $t('flow') }}</div>
			<g-select-flow
				v-model:value="useReportStore().currentField.linkValue"
				@change="setType"
			/>

			fsf
		</div>
		<div class="control">
			<div class="control-label">
				{{ $t('link') }}
			</div>
			<NColorPicker
				v-if="!hideColor"
				v-model:value="useReportStore().currentField.linkValueColor"
				:modes="['hex']"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'

defineProps<{
	hideColor?: boolean
}>()

const setType = () => {
	console.log(useReportStore().currentField.linkType, 'fsf')
	if (useReportStore().currentField.linkValue === 'none' || !useReportStore().currentField.linkValue) {
		useReportStore().currentField.linkType = 'none'
		useReportStore().currentField.linkValue = 'none'
	} else {
		useReportStore().currentField.linkType = 'link'
	}
}
</script>
