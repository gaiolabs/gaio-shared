<template>
	<div class="studio relative flex h-full grow dark:bg-gray-850/50 bg-gray-200/25">
		<template v-if="!loading">
			<Sidebar
				v-model="sidebarPanel"
				class="z-10"
				@choose="selectElement"
			/>
			<SidebarNav
				v-model="sidebarPanel"
				class="z-20"
			/>
			<VueDraggable
				v-model="items"
				class="drag-table absolute inset-0"
				ghost-class="drag-hide"
				:group="{ name: 'sources', pull: false, put: true }"
				handle=".handle-board"
				@add="addDrag"
			>
				<BoardView
					:key="useAppStore().refreshKey"
					@choose="selectElement"
					@open="selectElement"
				/>
			</VueDraggable>
			<!--            <table-view-->
			<!--                v-if="showDrawer === 'tableView'"-->
			<!--                class="z-30"-->
			<!--                :table-name="currentTable"-->
			<!--                @close="closeTable()"-->
			<!--            />-->
			<table-view
				v-if="showDrawer === 'table'"
				class="z-30"
				@close="showDrawer = undefined"
			/>
			<task-log-view
				v-if="showDrawer === 'taskLogView'"
				class="z-30"
				@close="showDrawer = undefined"
			/>
			<task-builder
				v-if="showDrawer === 'builder'"
				class="z-30"
				@close="closeTask()"
			/>
			<!--            <task-builder v-if="showDrawer === 'builder'" class="z-30" @close="closeTask()" />-->
			<task-form-builder
				v-if="showDrawer === 'form'"
				class="z-30"
				@close="closeTask()"
			/>
			<task-explorer-view
				v-if="showDrawer === 'report'"
				class="z-30"
				@close="closeTask()"
			/>
			<task-static-content
				v-if="showDrawer === 'staticContent'"
				class="z-30"
				@close="closeTask()"
			/>
			<TaskQuery
				v-if="showDrawer === 'query'"
				class="z-30"
				@close="closeTask()"
			/>
			<sidebar-sub-nav
				class="z-40"
				:is-bucket-table="isBucketTable"
				@choose="selectElement"
			/>
			<component
				:is="currentElement"
				v-if="currentElement"
				@choose="selectAndClose"
				@close="closeTask()"
				@close-and-refresh="closeTask()"
			/>
		</template>
		<NSpin
			v-else
			class="h-full w-full"
		/>
	</div>
</template>
<script setup lang="ts">
import useBus from '@/composables/useBus'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore, useJobStore } from '@/stores'
import BoardView from '@/views/studio/canvas/board-view/BoardView.vue'
import SidebarSubNav from '@/views/studio/canvas/sidebar/SidebarSubNav.vue'
import TableView from '@/views/studio/canvas/table-view/TableView.vue'
import TaskBuilder from '@/views/studio/canvas/task-builder/TaskBuilder.vue'
import TaskExplorerView from '@/views/studio/canvas/task-explorer/TaskExplorerView.vue'
import TaskFormBuilder from '@/views/studio/canvas/task-form-builder/TaskFormBuilder.vue'
import TaskLogView from '@/views/studio/canvas/task-log-view/TaskLogView.vue'
import TaskQuery from '@/views/studio/canvas/task-query/TaskQuery.vue'
import TaskStaticContent from '@/views/studio/canvas/task-static-content/TaskStaticContent.vue'
import Sidebar from '@/views/studio/StudioSidebar.vue'
import SidebarNav from '@/views/studio/StudioSidebarNav.vue'
import { taskView } from '@/views/studio/StudioViewTask'
import type { TableType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import type { SortableEvent } from 'sortablejs'
import { computed, onMounted } from 'vue'
import { defineComponent, onBeforeUnmount, ref, shallowRef } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

defineComponent({
	components: {
		...taskView,
	},
})

const currentTable = ref<string>()

const items = ref([])
const loading = ref(true)
const sidebarPanel = ref('flow')
watch(sidebarPanel, (oldValue, newValue) => {
	console.log(oldValue, newValue)
})
const showDrawer = ref('')
const currentElement = shallowRef()

const addDrag = (ev: SortableEvent) => {
	// @ts-expect-error TODO fix type
	const element = cloneDeep<TableType>(ev.item[Object.getOwnPropertySymbols(ev.item)[0]])

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: useDefault({
				type: 'table',
				base: {
					...useAppStore().appInfo,
					...element,
					label: element.tableName,
				},
			}),
			sources: [],
			targets: [],
		})
		.save()
		.then(() => closeTask())
}

const closeTask = () => {
	showDrawer.value = undefined
	currentElement.value = undefined
	useAppStore().refreshKey = getId()
	useAppStore().task = undefined
}

const isBucketTable = computed(() => {
	return !!(useAppStore().task && useAppStore().task.type === 'table' && useAppStore().task.sourceType === 'bucket')
})

// @ts-expect-error TODO fix type
const selectAndClose = (ev) => {
	closeTask()
	selectElement(ev)
}

const selectElement = (item: { taskLog: string; type: string; reportType: string }) => {
	if (item.taskLog) {
		showDrawer.value = 'taskLogView'
	} else if (item.type === 'reportPreview') {
		currentElement.value = taskView.TaskReportPreview
	} else if (item.reportType) {
		switch (item.reportType) {
			case 'form':
				currentElement.value = taskView.TaskFormCard
				break
			case 'staticContent':
				showDrawer.value = 'staticContent'
				break
			default:
				showDrawer.value = 'report'
				break
		}
	} else {
		switch (item.type) {
			case 'table':
				showDrawer.value = 'table'
				break
			case 'builder':
				showDrawer.value = 'builder'
				break
			case 'report':
				showDrawer.value = 'report'
				break
			case 'form':
				showDrawer.value = 'form'
				break
			case 'staticContent':
				showDrawer.value = 'staticContent'
				break
			case 'query':
				showDrawer.value = 'query'
				break
			case 'update':
				currentElement.value = taskView.TaskUpdate
				break
			case 'delete':
				currentElement.value = taskView.TaskDelete
				break
			case 'sample':
				currentElement.value = taskView.TaskSample
				break
			case 'cluster':
				currentElement.value = taskView.TaskCluster
				break
			case 'insertRow':
				currentElement.value = taskView.TaskInsertRow
				break
			case 'create':
				currentElement.value = taskView.TaskCreateTable
				break
			case 'flow':
				currentElement.value = taskView.TaskRunFlow
				break
			case 'pivot':
				currentElement.value = taskView.TaskPivotTable
				break
			case 'unpivot':
				currentElement.value = taskView.TaskUnpivotTable
				break
			case 'rest':
				currentElement.value = taskView.TaskRest
				break
			case 'tableToParam':
				currentElement.value = taskView.TaskTableToParam
				break
			case 'paramToTable':
				currentElement.value = taskView.TaskParamToTable
				break
			case 'userMirror':
				currentElement.value = taskView.TaskUserMirror
				break
			case 'csvUrl':
				currentElement.value = taskView.TaskCsvWeb
				break
			case 'googleSpreadsheet':
				currentElement.value = taskView.TaskGoogleSpreadsheet
				break
			case 'pca':
				currentElement.value = taskView.TaskPca
				break
			case 'localCsv':
				currentElement.value = taskView.TaskCsvLocal
				break
			case 'basket':
				currentElement.value = taskView.TaskAssociationRules
				break
			case 'timeseries':
				currentElement.value = taskView.TaskForecast
				break
			case 'export':
				currentElement.value = taskView.TaskExportCsv
				break
			case 'insert':
				currentElement.value = taskView.TaskInsertTable
				break
			case 'quickTable':
				currentElement.value = taskView.TaskQuickTable
				break

			default:
				break
		}
	}
}

useBus.on('openTable', (table: string) => {
	currentTable.value = table
	showDrawer.value = 'tableView'
})

onMounted(async () => {
	loading.value = true
	await useAppStore().loadApp()
	loading.value = false
	useAppStore().observeUpdateFlow()
})

onBeforeUnmount(() => {
	console.log('close')
	useAppStore().closeEventSource()
	useJobStore().closeEventSource()
})
</script>
