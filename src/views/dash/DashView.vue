<template>
	<div
		class="dash-view"
		:class="{ 'dash-edit': gridOptions.editGrid }"
	>
		<n-spin
			v-if="loading"
			class="h-[400px] w-full"
		/>
		<div
			v-else
			class="dash-view-body h-full overflow-y-auto"
		>
			<dash-menu
				:flow-list="flowList"
				:toggle-fullscreen="toggle"
				:is-preview-page="isPreviewPage"
				@close="closeDashboard"
				@refresh="changeLocalKey"
				@choose="navigateToFlow"
			/>
			<dash-grid-options
				v-if="isPreviewPage"
				:grid-options="gridOptions"
			/>

			<template
				v-for="(dashFlow, dashIndex) of dashList"
				:key="dashIndex"
			>
				<template v-if="dashIndex === 0 || dashFlow.options.dashboardType !== 'dialog'">
					<dash-grid
						ref="dash"
						:key="dashFlow.refreshKey"
						:current-flow="dashFlow"
						:grid-options="gridOptions"
						:is-preview-page="isPreviewPage"
						class="mx-1"
						:class="{ 'mt-[50px]': !isPreviewPage }"
						@trigger="triggerFlow"
					/>
				</template>
				<template v-else>
					<dash-dialog @close="destroyDashboard">
						<template #title>{{ dashFlow.flowName }}</template>
						<template #content>
							<dash-grid
								ref="dash"
								:key="dashFlow.refreshKey"
								:current-flow="dashFlow"
								:grid-options="{
									...gridOptions,
									editGrid: false
								}"
								:is-preview-page="isPreviewPage"
								class="mx-1"
								:class="{ 'mt-[50px]': !isPreviewPage }"
								@trigger="triggerFlow"
							/>
						</template>
					</dash-dialog>
				</template>
			</template>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
import DashDialog from '@/views/dash/DashDialog.vue'
import DashGrid from '@/views/dash/DashGrid.vue'
import DashGridOptions from '@/views/dash/DashGridOptions.vue'
import type { ActionType, DashFlowItem, GridOptionsType } from '@/views/dash/DashTypes'
import type { FlowType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashMenu from './DashMenu.vue'

const gridOptions = ref<GridOptionsType>({
	editGrid: false,
	currentLayout: 'lg',
	viewPortSize: {},
	refreshLayoutKey: 'any'
})

const toggle = () => {}
const dashList = ref<DashFlowItem[]>([])
const loading = ref(true)
const router = useRouter()
const localKey = ref('any')
const flowList = ref<FlowType[]>([])

const isPortalPage = computed(() => router.currentRoute.value.name === 'portal')
const isPreviewPage = computed(() => router.currentRoute.value.name === 'preview')

const changeLocalKey = () => (localKey.value = getId())

const refreshViewByKey = computed(() => {
	return `${localKey.value}-${currentFlow.value?.flowId || ''}`
})

const defineDashboardFlowList = () => {
	flowList.value = useAppStore().flowList.filter(
		(flow) => flow.flowType === 'infoPub' && flow.options.dashboardType === 'page'
	)
}

const runDashboardByFlowId = (flowId: string) => {
	useAppStore().flow = useAppStore().flowList.find((flow) => flow.flowId === flowId)
	dashList.value.push({
		...useAppStore().flow,
		refreshKey: getId()
	})
}

const refreshFlow = (flowId: string) => {
	dashList.value.forEach((f) => {
		if (f.flowId === flowId) {
			f.refreshKey = getId()
		}
	})
}

const currentFlow = computed<FlowType>(() => {
	return dashList.value[dashList.value.length - 1]
})

const navigateToFlow = (flowId: string) => {
	dashList.value = []
	runDashboardByFlowId(flowId)
}

const triggerFlow = (action: ActionType) => {
	// loading = true;
	// GO/OPEN TO FLOW
	if (action && action.flowId) {
		const flow = dashList.value.find((f) => f.flowId === action.flowId)

		if (!flow) {
			runDashboardByFlowId(action.flowId)
			refreshFlow(action.flowId)
		} else if (action.flowId === currentFlow.value.flowId) {
			refreshFlow(action.flowId)
		} else {
			if (dashList.value.length > 1) {
				const flowIndex = dashList.value.findIndex((f) => f.flowId === action.flowId)
				if (flowIndex >= 0 && flowIndex < dashList.value.length - 1) {
					// loading.value = true;
					setTimeout(() => {
						refreshFlow(action.flowId)
						dashList.value.splice(flowIndex + 1, dashList.value.length - (flowIndex + 1))
					})
				}
			}
		}
	} else if (action && action.formType === 'loadFlow') {
		// LOAD FLOW, THEN
		if (action.formReload) {
			// RELOAD CURRENT FLOW
			refreshFlow(currentFlow.value.flowId)
		} else {
			// loading = false;
		}
	}
}

const destroyDashboard = () => {
	// loading = false;
	if (dashList.value.length > 1) {
		const dashListSize = dashList.value.length
		const lastFlow = dashList.value[dashListSize - 1]
		const previousFlow = dashList.value[dashListSize - 2]
		dashList.value = dashList.value.filter((f) => f.flowId === lastFlow.flowId)

		useAppStore().flow = previousFlow
		if (lastFlow.options && lastFlow.options?.dialogOnDestroy && lastFlow.options.dialogOnDestroy !== 'none') {
			switch (lastFlow.options.dialogOnDestroy) {
				case 'resetFlow':
					refreshFlow(previousFlow.flowId)
					break
				case 'resetParams':
					useAppStore().defineDefaultParams()
					break
				case 'resetParamsAndFlow':
					useAppStore().defineDefaultParams()
					refreshFlow(previousFlow.flowId)
					break
			}
		}
	} else {
		closeDashboard()
	}
}

const closeDashboard = () => {
	if (!isPortalPage.value) {
		if (isPreviewPage.value) {
			router.push('/studio')
		} else {
			router.push('/home')
		}
	}
}

const initAppAfterMount = (currentFlowId: string) => {
	if (isPreviewPage.value) {
		triggerFlow({ flowId: currentFlowId })
		gridOptions.value.editGrid = true
	} else {
		if (flowList.value.length) {
			runDashboardByFlowId(flowList.value[0].flowId)
		}
	}
}

onMounted(async () => {
	const currentFlowId = useAppStore().flow.flowId
	await useAppStore()
		.loadApp(useAppStore().app.appId)
		.then(() => {
			defineDashboardFlowList()
			initAppAfterMount(currentFlowId)

			if (isPreviewPage.value) {
				gridOptions.value.editGrid = true
			}

			loading.value = false
		})
})
</script>
