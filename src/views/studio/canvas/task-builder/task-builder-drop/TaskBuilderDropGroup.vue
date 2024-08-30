<template>
	<div class="task-builder-drop-group block">
		<div class="mx-1 flex items-center justify-between gap-1">
			<div class="flex items-center gap-1 font-bold">
				<g-icon name="group" />
				{{ $t('group') }}
				<span v-if="localTask.schema.sort.length">({{ localTask.schema.group.length }})</span>
			</div>
			<div class="mb-1 flex items-center gap-1">
				<NButton
					size="tiny"
					quaternary
					class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
					@click="addFieldsWithoutAggregation()"
				>
					<template #icon>
						<g-icon name="addCheck" />
					</template>
					{{ $t('addNoAggregationFields') }}
				</NButton>
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
			custom-class="group"
			:fields="localTask.schema.group"
			@choose="$emit('choose', $event)"
		/>
	</div>
</template>
<script setup lang="ts">
import type { BuilderTaskType } from '@gaio/shared/types'
import { uniqBy } from 'lodash-es'
import type { PropType } from 'vue'
import TaskBuilderDropTag from '../task-builder-tags/TaskBuilderDropTag.vue'
defineEmits(['choose'])
const props = defineProps({
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})

const addFieldsWithoutAggregation = () => {
	const fields = props.localTask.schema.select.filter((field) => {
		return field.type === 'value'
	})

	props.localTask.schema.group = uniqBy(props.localTask.schema.group.concat(fields), 'columnName')
}

const removeAll = () => {
	props.localTask.schema.group = []
}
</script>
