<template>
	<div class="task-static-content">
		<DrawerView
			:only-full-screen="true"
			@close="$emit('close')"
		>
			<template #header>
				<TaskStaticContentMenu @close="$emit('close')" />
			</template>
			<template #content>
				<Splitpanes>
					<Pane :size="viewControl.sideBarSize">
						<TaskStaticContentSideBar />
					</Pane>
					<Pane :size="viewControl.codeFrameSize">
						<TaskStaticContentCodeFrame />
					</Pane>
					<Pane :size="viewControl.previewSize">
						<TaskStaticContentCodeResult />
					</Pane>
				</Splitpanes>
			</template>
		</DrawerView>
	</div>
</template>

<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import useDefaultReport from '@/composables/useDefaultReport'
import { useAppStore } from '@/stores'
import type { ReportNodeType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { Pane, Splitpanes } from 'splitpanes'
import { onBeforeMount, onUnmounted } from 'vue'
import TaskStaticContentCodeFrame from './components/TaskStaticContentCodeFrame.vue'
import TaskStaticContentCodeResult from './components/TaskStaticContentCodeResult.vue'
import TaskStaticContentMenu from './components/TaskStaticContentMenu.vue'
import TaskStaticContentSideBar from './components/TaskStaticContentSideBar.vue'
import { useCodeDataStore, useViewControlStore } from './store/useTaskStaticContentStore'

defineEmits(['close'])

const viewControl = useViewControlStore()
onBeforeMount(() => useCodeDataStore().init())
onUnmounted(() => useCodeDataStore().resetStore())
</script>
