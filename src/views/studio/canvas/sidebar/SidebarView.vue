<template>
	<div
		class="sidebar flex h-full w-[450px] max-w-[450px] items-center border-neutral-800 pt-[70px] text-black dark:text-white"
		:class="{ 'w-[500px]': modelValue }"
	>
		<!--SIDEBAR PANEL-->
		<div
			v-if="modelValue"
			class="fade-in-left flex size-full flex-col ps-[35px]"
		>
			<div class="mb-2 h-full grow overflow-hidden rounded-[10px] border-elevation-2 bg-paper-100 dark:bg-carbon-200">
				<template v-if="panel === 'flow'">
					<sidebar-flow />
				</template>
				<template v-else-if="panel === 'source'">
					<sidebar-source />
				</template>
				<template v-else-if="panel === 'params'">
					<sidebar-param />
				</template>
				<template v-else-if="panel === 'tasks'">
					<sidebar-task @choose="$emit('choose', $event)" />
				</template>
				<template v-else-if="panel === 'forms'">
					<sidebar-form @choose="$emit('choose', $event)" />
				</template>
				<template v-else-if="panel === 'discovery'">
					<sidebar-discovery @choose="$emit('choose', $event)" />
				</template>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import SidebarDiscovery from '@/views/studio/canvas/sidebar/sidebar-discovery/SidebarDiscovery.vue'
import SidebarFlow from '@/views/studio/canvas/sidebar/sidebar-flow/SidebarFlow.vue'
import SidebarForm from '@/views/studio/canvas/sidebar/sidebar-form/SidebarForm.vue'
import SidebarParam from '@/views/studio/canvas/sidebar/sidebar-param/SidebarParam.vue'
import SidebarSource from '@/views/studio/canvas/sidebar/sidebar-source/SidebarSource.vue'
import SidebarTask from '@/views/studio/canvas/sidebar/sidebar-task/SidebarTask.vue'
import { computed } from 'vue'

defineEmits(['update:modelValue', 'choose'])
const { modelValue = 'discovery' } = defineProps<{ modelValue: string | undefined }>()

const panel = computed(() => modelValue)
</script>

<style lang="scss">
.sidebar {
	background: transparent;

	.sidebar-nav {
		//z-index: 1;
		//border-right: 1px solid #2d2d2d;
		//overflow: visible;
		//background: #181818 !important;

		.inactive-pane {
			color: #fff;
			border-right: 1px solid transparent;
			margin-right: -1px;
		}

		.active-pane {
			color: #f8ab71;
			//background: #181818;
			border-right: 1px solid #f8ab71;
			margin-right: -1px;
		}
	}
}
</style>
