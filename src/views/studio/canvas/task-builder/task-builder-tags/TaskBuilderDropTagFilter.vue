<template>
	<div
		class="task-builder-drop-tag min-h-[30px] w-full rounded-[8px] border-elevation-2 bg-paper-100 p-2 dark:bg-carbon-200"
	>
		<drag
			:list="fields"
			class="flex flex-wrap gap-1"
			:group="{ name: 'items', pull: 'clone' }"
			pull="clone"
			@change="updateFields"
		>
			<div
				v-for="(field, i) in fields"
				:key="i"
				class="flex gap-1"
			>
				<n-tag
					v-if="field && i > 0"
					@click="interchangeAndOr(field)"
				>
					{{ $t(field.andOr || 'and') }}
				</n-tag>
				<v-tag
					v-if="field"
					:key="i"
					:field="field"
					@click="$emit('choose', field)"
				/>
			</div>
		</drag>
	</div>
</template>

<script setup lang="ts">
import { onDragMove } from '@/views/studio/canvas/task-builder/task-builder-tags/TasBuilderDragHelper'
import type { FieldType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { VueDraggableNext as Drag } from 'vue-draggable-next'

defineEmits(['choose'])
const props = withDefaults(defineProps<{ fields: FieldType[] }>(), {
	fields: () => []
})

const updateFields = (evt) => {
	if (evt.added) {
		props.fields[evt.added.newIndex] = cloneDeep(evt.added.element)
		onDragMove(props.fields[evt.added.newIndex], 'filter')
	}
}

const interchangeAndOr = (field) => {
	field.andOr = field.andOr === 'and' ? 'or' : 'and'
}
</script>
