<template>
	<div
		class="task-builder-drop-tag min-h-[30px] w-full rounded-[8px] border-elevation-2 bg-paper-100 p-2 dark:bg-carbon-200"
	>
		<drag
			:list="fields"
			class="flex flex-wrap gap-1"
			:class="customClass"
			:group="{ name: 'items', pull: 'clone' }"
			pull="clone"
			@change="updateFields"
		>
			<v-tag
				v-for="(field, i) in fields"
				:key="i"
				:field="field"
				@click="$emit('choose', field)"
			/>
		</drag>
	</div>
</template>

<script setup lang="ts">
import type { FieldType, GenericType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { VueDraggableNext as Drag } from 'vue-draggable-next'
import { onDragMove } from './TasBuilderDragHelper'

defineEmits(['choose'])
const { fields = [] } = defineProps<{ fields: FieldType[]; customClass: string }>()

const updateFields = (evt: GenericType) => {
	if (evt.added) {
		fields[evt.added.newIndex] = cloneDeep(evt.added.element)
		onDragMove(fields[evt.added.newIndex], type)
	}
}
</script>
