<template>
	<div class="studio relative flex h-full grow bg-elevation-1">
		<board-background />
		<template v-if="!loading">
			<sidebar
				v-model="sidebarPanel"
				class="z-10"
				@choose="selectElement"
			/>
			<sidebar-nav
				v-model="sidebarPanel"
				class="z-20"
			/>
			<vue-draggable
				v-model="items"
				class="drag-table h-full w-full"
				ghost-class="drag-hide"
				:group="{ name: 'sources', pull: false, put: true }"
				handle=".handle-board"
				@add="addDrag"
			>
				<board-view
					:key="useAppStore().refreshKey"
					@choose="selectElement"
					@open="selectElement"
				/>
			</vue-draggable>
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
import BoardBackground from '@/views/studio/canvas/board-view/BoardBackground.vue'
import BoardView from '@/views/studio/canvas/board-view/BoardView.vue'
import SidebarNav from '@/views/studio/canvas/sidebar/SidebarNav.vue'
import SidebarSubNav from '@/views/studio/canvas/sidebar/SidebarSubNav.vue'
import Sidebar from '@/views/studio/canvas/sidebar/SidebarView.vue'
import TableView from '@/views/studio/canvas/table-view/TableView.vue'
import TaskBuilder from '@/views/studio/canvas/task-builder/TaskBuilder.vue'
import TaskExplorerView from '@/views/studio/canvas/task-explorer/TaskExplorerView.vue'
import TaskFormBuilder from '@/views/studio/canvas/task-form-builder/TaskFormBuilder.vue'
import TaskLogView from '@/views/studio/canvas/task-log-view/TaskLogView.vue'
import TaskStaticContent from '@/views/studio/canvas/task-static-content/TaskStaticContent.vue'
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
		...taskView
	}
})

const currentTable = ref<string>()
const closeTable = () => {
	showDrawer.value = undefined
	currentTable.value = undefined
}

const addDrag = (ev: SortableEvent) => {
	const element = cloneDeep<TableType>(ev.item[Object.getOwnPropertySymbols(ev.item)[0]])

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: useDefault({
				type: 'table',
				base: {
					...useAppStore().appInfo,
					...element,
					label: element.tableName
				}
			}),
			sources: [],
			targets: []
		})
		.save()
		.then(() => closeTask())
}

const items = ref([])
const loading = ref(true)
const sidebarPanel = ref()
const showDrawer = ref()
const currentElement = shallowRef()

const closeTask = () => {
	showDrawer.value = undefined
	currentElement.value = undefined
	useAppStore().refreshKey = getId()
	useAppStore().task = undefined
}

const isBucketTable = computed(() => {
	return !!(useAppStore().task && useAppStore().task.type === 'table' && useAppStore().task.sourceType === 'bucket')
})

const selectAndClose = (ev) => {
	closeTask()
	selectElement(ev)
}

const selectElement = (item: { taskLog: string; type: string; reportType: string }) => {
	console.log('choose', item)
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
	console.log('openTable')
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
