<template>
	<div class="dash-menu fixed left-1 right-1 top-2 z-10 px-2">
		<div class="g-bg-1 flex items-center gap-2 rounded px-2 shadow">
			<NButton
				secondary
				size="tiny"
				@click="emit('close')"
			>
				<template #icon>
					<IconComponent name="ChevronLeft" />
				</template>
			</NButton>
			<NDivider
				vertical
				class="m-0 p-0"
			/>
			<div
				v-if="flowList.length && activeFlow"
				class="flex-grow"
			>
				<NMenu
					v-model:value="activeFlow"
					mode="horizontal"
					label-field="flowName"
					key-field="flowId"
					:options="flowList"
					responsive
					@update:value="selectFlow"
				/>
			</div>
			<div class="flex items-center gap-2">
				<NDivider
					vertical
					class="m-0 p-0"
				/>
				<NButton
					secondary
					size="tiny"
					@click="$emit('refresh')"
				>
					<template #icon>
						<g-icon name="refresh" />
					</template>
				</NButton>
				<NButton
					v-if="isPreviewPage"
					secondary
					size="tiny"
					@click="showParameters = true"
				>
					<template #icon>
						<g-icon name="params" />
					</template>
				</NButton>
				<NButton
					secondary
					size="tiny"
					@click="toggleFullscreen()"
				>
					<template #icon>
						<g-icon name="fullscreen" />
					</template>
				</NButton>
			</div>
		</div>
		<dash-params
			v-if="isPreviewPage"
			:show-parameters="showParameters"
			@close="showParameters = false"
		/>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
import DashParams from '@/views/dash/DashParams.vue'
import type { FlowType } from '@gaio/shared/types'
import { NMenu } from 'naive-ui'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['choose', 'refresh', 'close'])
const {
	isPreviewPage,
	flowList = [],
	toggleFullscreen
} = defineProps<{
	isPreviewPage: boolean
	flowList: FlowType[]
	toggleFullscreen: () => void
}>()

const activeFlow = ref('')
const showParameters = ref(false)

const selectFlow = (flowId: string) => {
	emit('choose', flowId)
}

onMounted(() => {
	console.log(useAppStore().flow)
	activeFlow.value = useAppStore().flow.flowId
})
</script>

<style lang="scss">
.dash-menu {
	.n-menu .n-menu-item-content {
		line-height: 1;
		padding: 0.5rem 0.75rem;
	}

	.n-menu-item-content:hover {
		background: rgba(0, 0, 0, 0.071);
		color: var(--color-primary);
	}
}
</style>
