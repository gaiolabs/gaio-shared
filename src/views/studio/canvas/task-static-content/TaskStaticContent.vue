<template>
	<div class="task-static-content">
		<DrawerView :only-full-screen="true" @close="$emit('close')">
			<template #header>
				<TaskStaticContentMenu :local-task="localTask" @close="$emit('close')" />
			</template>
			<template #content>
				<Splitpanes>
					<Pane :size="panelsSize.sideBarSize">
						<TaskStaticContentSideBar />
					</Pane>
					<Pane :size="panelsSize.codeFrameSize">
						<TaskStaticContentCodeFrame />
					</Pane>
					<Pane :size="panelsSize.previewSize">
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
import { useAppStore, useReportStore } from '@/stores'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'
import { getId } from '@gaio/shared/utils'
import { Pane, Splitpanes } from 'splitpanes'
import { computed, onBeforeMount, ref } from 'vue'
import TaskStaticContentCodeFrame from './components/TaskStaticContentCodeFrame.vue'
import TaskStaticContentCodeResult from './components/TaskStaticContentCodeResult.vue'
import TaskStaticContentMenu from './components/TaskStaticContentMenu.vue'
import TaskStaticContentSideBar from './components/TaskStaticContentSideBar.vue'
import { useTaskStaticContentStore } from './store/useTaskStaticContentStore'

defineEmits(['close'])

const localTask = ref<StaticContentType>()
const viewControlStore = useTaskStaticContentStore()

const localField = ref<{ type: string; field: Partial<FieldType> }>({
	type: '',
	field: {} as FieldType
})

const editComputed = (field: FieldType) => {
	defineLocalField('computed', field)
}

const defineLocalField = (type: string, field: FieldType) => {
	localField.value = {
		type,
		field
	}
}

onBeforeMount(() => {
	useReportStore().resetReport()
	useReportStore().current = useDefaultReport({
		type: 'report',
		reportType: useAppStore().cloneTask()?.reportType || 'staticContent',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask(),
			id: useAppStore().cloneTask().type !== 'report' ? getId() : useAppStore().cloneTask()?.id
		} as ReportNodeType
	})
})

const panelsSize = computed(() => {
	if (viewControlStore.showPreview && viewControlStore.showSideBar)
		return {
			sideBarSize: 16,
			codeFrameSize: 42,
			previewSize: 42
		}
	else if (viewControlStore.showPreview && !viewControlStore.showSideBar)
		return {
			sideBarSize: 0,
			codeFrameSize: 68,
			previewSize: 42
		}
	else if (!viewControlStore.showPreview && viewControlStore.showSideBar)
		return {
			sideBarSize: 16,
			codeFrameSize: 84,
			previewSize: 0
		}
	else
		return {
			sideBarSize: 0,
			codeFrameSize: 100,
			previewSize: 0
		}
})
</script>
