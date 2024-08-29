<template>
	<div class="m-3 flex flex-wrap gap-2">
		<div
			v-for="field of usePowerStore().filteredContextField"
			:key="field.id"
		>
			<v-tag
				:field="field"
				@click="addTag(field)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePowerStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'

const addTag = (field: FieldType) => {
	if (!usePowerStore().tags) {
		usePowerStore().tags = []
	}

	usePowerStore().tags.push({
		...field,
		variant: usePowerStore().searchTerm
	})

	usePowerStore().currentPanel = 'report'
}
</script>
