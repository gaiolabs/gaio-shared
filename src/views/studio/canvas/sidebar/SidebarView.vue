<template>
	<div
		id="sidebar-view"
		class="flex h-full w-[450px] max-w-[450px] items-center p-4 pl-8 pr-0 pt-[74px]"
	>
		<!--SIDEBAR PANEL-->
		<Transition
			enter-active-class="transition-all duration-150 ease-out"
			enter-from-class="opacity-0 -translate-x-2"
			enter-to-class="opacity-100"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100 "
			leave-to-class="opacity-0 -translate-x-2"
			mode="out-in"
		>
			<div
				v-if="modelValue"
				id="sidebar-panel"
				class="flex size-full flex-col"
			>
				<div class="h-full grow overflow-hidden rounded-xl g-base">
					<Transition
						enter-active-class="transition-opacity absolute top-0 left-0 duration-300"
						enter-from-class="opacity-0"
						enter-to-class="opacity-100"
						leave-active-class="transition-opacity absolute top-0 left-0 duration-300"
						leave-from-class="opacity-100"
						leave-to-class="opacity-0"
					>
						<template v-if="panel === 'flow'">
							<sidebar-flow class="w-full" />
						</template>
						<template v-else-if="panel === 'database'">
							<sidebar-source class="w-full" />
						</template>
						<template v-else-if="panel === 'params'">
							<sidebar-param class="w-full" />
						</template>
						<template v-else-if="panel === 'tasks'">
							<sidebar-task
								class="w-full"
								@choose="$emit('choose', $event)"
							/>
						</template>
						<template v-else-if="panel === 'forms'">
							<sidebar-form
								class="w-full"
								@choose="$emit('choose', $event)"
							/>
						</template>
						<template v-else-if="panel === 'discovery'">
							<sidebar-discovery
								class="w-full"
								@choose="$emit('choose', $event)"
							/>
						</template>
					</Transition>
				</div>
			</div>
		</Transition>
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
const { modelValue } = defineProps<{ modelValue: string | undefined }>()

const panel = computed(() => modelValue)
</script>

<style lang="scss">
// .sidebar {
// 	.sidebar-nav {
// 		//z-index: 1;
// 		//border-right: 1px solid #2d2d2d;
// 		//overflow: visible;
// 		//background: #181818 !important;

// 		.inactive-pane {
// 			color: #fff;
// 			border-right: 1px solid transparent;
// 			margin-right: -1px;
// 		}

// 		.active-pane {
// 			color: #f8ab71;
// 			//background: #181818;
// 			border-right: 1px solid #f8ab71;
// 			margin-right: -1px;
// 		}
// 	}
// }
</style>
