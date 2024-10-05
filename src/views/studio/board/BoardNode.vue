<template>
	<article
		v-if="data"
		id="board-node-wrapper"
		class="board-node-wrapper group cursor-pointer"
		:class="[status, isSelected ? 'selected' : '']"
	>
		<div class="">
			<!-- :class="nodeStyle" -->
			<div
				style="--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.075), 0 2px 4px -2px rgb(0 0 0 / 0.075)"
				class="flex flex-col items-center justify-center gap-3 rounded-lg p-1"
			>
				<div id="board-icon">
					<img
						class="size-[28px]"
						:src="generateIcon(data)"
						alt="Board Icon"
					/>
				</div>
				<div
					v-if="data.type !== 'reportPreview'"
					class="flex items-center flex-col absolute bottom-0 translate-y-[90%] z-[-1]"
				>
					<div
						class="truncate w-full max-w-52 group-hover:max-w-full duration-150 ease-out px-1 rounded-md backdrop-blur-lg"
					>
						{{ data.label || 'label' }}
					</div>
					<small class="text-gray text-xs font-light">{{ data.type }}</small>
				</div>
			</div>
			<Handle
				id="b"
				type="target"
				:position="Position.Left"
			/>
			<Handle
				id="a"
				type="source"
				:position="Position.Right"
			/>
		</div>
	</article>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useJobStore } from '@/stores/useJobStore'
import { generateBase } from '@/views/studio/board/BoardIcons'
import type { NodeType, TaskJobType } from '@gaio/shared/types'
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

const { data = null } = defineProps<{ data: NodeType }>()

const generateIcon = (item: NodeType) => {
	const image = `../../../../assets${generateBase(item).image}`
	return new URL(image, import.meta.url).href
}

const getCurrentTaskId = computed(() => {
	return useAppStore().task?.id
})

const { lastJobTasks } = useJobStore()

const isSelected = computed(() => {
	return getCurrentTaskId.value === data.id
})

const status = computed(() => {
	return taskJobMeta.value.status
})

const taskJobMeta = computed<TaskJobType>(() => {
	if (lastJobTasks) {
		return useJobStore().lastJobTasks[data.id] || {}
	}
	return {}
})
</script>

<style lang="scss" scoped>
.board-node-wrapper {
	@apply rounded-lg ring-0 duration-150;
	&.selected {
		@apply ring-2 ring-offset-2 ring-offset-white/50 dark:ring-offset-black/50 ring-gray-300 dark:ring-gray-600;
	}

	#board-icon {
		@apply flex size-[45px] items-center justify-center gap-2 rounded-md mb-px transition-all duration-150 ring-0;
		@apply text-white border border-white shadow dark:border-white/[7.5%] bg-white/50 backdrop-blur-[5px] dark:bg-gray-800/40;

		&:hover {
			@apply shadow-lg;
		}
	}

	&.started #board-icon {
		@apply border-yellow-500 ring-2 ring-yellow-400/20 bg-yellow-50 shadow-yellow-900/20 dark:border-yellow-800 dark:ring-yellow-600/10 dark:bg-yellow-700/10 dark:shadow-yellow-600/20;
	}

	&.ended #board-icon {
		@apply border-green-500 ring-2 ring-green-400/20 bg-green-50 shadow-green-900/20 dark:border-green-800 dark:ring-green-600/10 dark:bg-green-700/10 dark:shadow-green-600/20;
	}

	&.error #board-icon {
		@apply border-red-500 ring-2 ring-red-400/20 bg-red-50 shadow-red-900/20 dark:border-red-800 dark:ring-red-600/10 dark:bg-red-700/10 dark:shadow-red-600/20;
	}

	&.aborted #board-icon {
		@apply border-violet-500 ring-2 ring-violet-400/20 bg-violet-50 shadow-violet-900/20 dark:border-violet-800 dark:ring-violet-600/10 dark:bg-violet-700/10 dark:shadow-violet-600/20;
	}
}

.isPressed {
	.board-node-wrapper {
		@apply cursor-grab;
	}
}

.dragging {
	.board-node-wrapper {
		@apply cursor-grabbing;
	}
}
</style>
