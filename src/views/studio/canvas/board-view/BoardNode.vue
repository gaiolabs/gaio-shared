<template>
	<div
		v-if="data"
		class="board-node"
		:class="minW"
	>
		<div
			class="g-bg-100 rounded-[10px] p-0"
			:class="nodeStyle"
		>
			<div class="flex items-center gap-2 leading-3">
				<div class="flex size-[45px] items-center justify-center gap-2 rounded-[8px] text-white">
					<img
						class="size-[30px]"
						:src="generateIcon(data)"
						alt="Board Icon"
					/>
				</div>
				<div
					v-if="data.type !== 'reportPreview'"
					class="flex max-w-[150px] items-center"
				>
					<div class="max-w-[160px] pe-3">
						<small class="text-gray text-xs font-light">{{ data.type }}</small>
						<div class="truncate text-sm">
							{{ data.label || 'label' }}
						</div>
					</div>
				</div>
			</div>
			<Handle
				v-if="!hideRightEdge"
				id="a"
				type="source"
				:position="Position.Right"
			/>
			<Handle
				id="b"
				type="target"
				:position="Position.Left"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useJobStore } from '@/stores/useJobStore'
import { generateBase } from '@/views/studio/canvas/board-view/BoardIcons'
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

const nodeStyle = computed(() => {
	if (getCurrentTaskId.value === data.id) {
		return 'border border-zinc-500 !bg-[#f2ede7]'
	}
	const status = taskJobMeta.value.status

	if (status === 'started') {
		return 'border border-yellow-500 !bg-[#f2ede7]'
	}
	if (status === 'ended') {
		return 'border  border-green-500 !bg-[#e6f1ecce]'
	}
	if (status === 'error') {
		return 'border  border-red-500 !bg-[#f7efef]'
	}
	if (status === 'aborted') {
		return 'border border-[#DEB6FF] !bg-[#F5E8FF]'
	}
	return 'border border-transparent'
})

const taskJobMeta = computed<TaskJobType>(() => {
	if (lastJobTasks) {
		return useJobStore().lastJobTasks[data.id] || {}
	}
	return {}
})

const hideRightEdge = computed(() => {
	return data.type === 'reportPreview'
})

const minW = computed(() => {
	return data.type === 'reportPreview' ? '' : 'min-w-[120px]'
})
</script>

<style lang="scss">
.board-node {
	.board-node.start {
		background: #e32;
	}

	.dark .board-node-box {
		background: #f9f9f9;
	}
}
</style>
