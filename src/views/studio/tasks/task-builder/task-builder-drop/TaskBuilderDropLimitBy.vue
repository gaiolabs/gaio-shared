<template>
	<div class="task-builder-drop-limit-by block">
		<div class="mx-1 flex items-center justify-between gap-1">
			<div class="flex items-center gap-1 font-bold">
				{{ $t('limitBy') }}
				<span v-if="localTask.schema.limitBy.length">({{ localTask.schema.limitBy.length }})</span>
			</div>
			<div class="mb-1">
				<NTooltip :delay="1000">
					<template #trigger>
						<NButton
							quaternary
							size="tiny"
							type="error"
							class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
							@click="removeAll()"
						>
							<template #icon>
								<g-icon name="deleteTag" />
							</template>
						</NButton>
					</template>
					{{ $t('deleteAllTags') }}
				</NTooltip>
			</div>
		</div>
		<task-builder-drop-tag
			custom-class="limitBy"
			:fields="localTask.schema.limitBy"
			@choose="$emit('choose', $event)"
		/>
	</div>
</template>
<script setup lang="ts">
import TaskBuilderDropTag from '@/views/studio/tasks/task-builder/task-builder-tags/TaskBuilderDropTag.vue'
import type { BuilderTaskType } from '@gaio/shared/types'
import type { PropType } from 'vue'

defineEmits(['choose'])
const props = defineProps({
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})
const removeAll = () => {
	props.localTask.schema.limitBy = []
}
</script>
