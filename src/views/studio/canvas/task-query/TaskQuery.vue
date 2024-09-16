<template>
	<div class="task-query">
		<DrawerView
			:only-full-screen="true"
			@close="$emit('close')"
		>
			<template #header>
				<TaskQueryMenu @close="$emit('close')" />
			</template>
			<template #content>
				<div class="bg-red-500 w-full">
					<Splitpanes class="w-full">
						<Pane
							:size="viewControl.sideBarSize"
							class="p-2 flex flex-col bg-blue-400"
						>
							<div class="bg-white">asd</div>
							<!-- <TaskQuerySideBar /> -->
						</Pane>
						<Pane :size="viewControl.codeFrameSize">
							codeFrame
							<!-- <TaskStaticContentCodeFrame /> -->
						</Pane>
						<Pane :size="viewControl.previewSize">
							preview
							<!-- <TaskStaticContentCodeResult /> -->
						</Pane>
					</Splitpanes>
				</div>
			</template>
		</DrawerView>
	</div>
</template>

<script setup>
import DrawerView from '@/components/drawer/DrawerView.vue'
import TaskQueryMenu from '@/views/studio/canvas/task-query/components/TaskQueryMenu.vue'
import TaskQuerySideBar from '@/views/studio/canvas/task-query/components/TaskQuerySideBar.vue'
import { Pane, Splitpanes } from 'splitpanes'
import { useCodeDataStore, useViewControlStore } from './store/useTaskQueryStore'

defineEmits(['close'])
const viewControl = useViewControlStore()
</script>
