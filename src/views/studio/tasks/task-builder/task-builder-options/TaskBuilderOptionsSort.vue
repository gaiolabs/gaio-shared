<template>
	<div class="task-builder-options-sort mx-1 mt-2 rounded-[8px] bg-elevation-1 p-2">
		<NRadioGroup
			v-model:value="localField.field.order"
			size="small"
			type="button"
		>
			<NRadioButton
				value="asc"
				:label="$t('asc')"
			/>
			<NRadioButton
				value="desc"
				:label="$t('desc')"
			/>
		</NRadioGroup>
	</div>
</template>
<script setup lang="ts">
import type { FieldType } from '@gaio/shared/types'
import type { PropType } from 'vue'

defineProps({
	localField: {
		type: Object as PropType<{ type: string; field: Partial<FieldType> }>,
		required: true
	}
})
</script>
