<template>
	<g-dialog
		v-if="localFlow && localFlow.options"
		@close="$emit('close')"
	>
		<template #title>
			<div class="flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<div v-if="localFlow.appId">
						<IconComponent class="rotate-[-90deg]" name="studio" />
						{{ localFlow.flowName ? localFlow.flowName : $t('flow') }}
					</div>
					<div v-else>
						<IconComponent class="rotate-[-90deg]" name="studio" />
						{{ $t('newFlow') }}
					</div>
				</div>
				<template v-if="localFlow.flowId">
					<g-id :id="localFlow.flowId" />
				</template>
			</div>
		</template>
		<template #tabs>
			<div class="flow-control">
				<NTabs
					pane-class="bg-elevation-1"
					size="small"
					type="line"
					:default-value="currentTab"
				>
					<NTabPane
						name="general"
						:tab="$t('general')"
						display-directive="show:lazy"
					>
						<flow-control-general
							:local-flow="localFlow"
							class="my-4"
						/>
					</NTabPane>
					<NTabPane
						v-if="localFlow && localFlow.flowId"
						name="schedule"
						:tab="$t('schedule')"
						display-directive="show:lazy"
					>
						<flow-control-schedule
							:local-flow="localFlow"
							class="my-4"
						/>
					</NTabPane>
				</NTabs>
			</div>
			<div class="flex justify-between bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<div>
					<NSpace
						v-if="localFlow.flowId"
						size="small"
					>
						<NPopconfirm
							v-if="canDeleteFlow"
							:show-icon="false"
							:positive-button-props="{ type: 'error' }"
							:positive-text="$t('delete')"
							@positive-click="remove()"
						>
							<template #trigger>
								<NButton
									size="tiny"
									quaternary
									type="error"
								>
									<template #icon>
										<IconComponent name="Delete" />
									</template>
								</NButton>
							</template>
							{{ $t('deletionConfirmation') }}
						</NPopconfirm>
						<NButton
							size="tiny"
							quaternary
							type="primary"
							@click="replicateFlow()"
						>
							<template #icon>
								<g-icon name="clone" />
							</template>
						</NButton>
					</NSpace>
				</div>
				<NSpace>
					<NButton
						secondary
						@click="$emit('close')"
					>
						{{ $t('cancel') }}
					</NButton>
					<NButton
						:loading="loading"
						:disabled="validateFlow"
						type="primary"
						@click="save()"
					>
						{{ $t('save') }}
					</NButton>
				</NSpace>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useScheduleControl from '@/composables/useScheduleControl'
import { useAppStore } from '@/stores'
import type { FlowType } from '@gaio/shared/types'
import cronstrue from 'cronstrue'
import { cloneDeep } from 'lodash-es'
import { NButton } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import FlowControlGeneral from './FlowControlGeneral.vue'
import FlowControlSchedule from './FlowControlSchedule.vue'

const props = defineProps<{ flow: Partial<FlowType> }>()
const emit = defineEmits(['close', 'save'])
const localFlow = ref<FlowType | null>()
const currentTab = ref('general')
const loading = ref(false)
const backupSchedule: { cron: string | undefined; cronStatus: string | undefined } = {
	cron: undefined,
	cronStatus: undefined
}

const handleSaveSchedules = () => {
	if (backupSchedule.cron !== localFlow.value.cron || backupSchedule.cronStatus !== localFlow.value.cronStatus) {
		useScheduleControl().defineFlowSchedules([
			{
				appId: localFlow.value.appId,
				flowId: localFlow.value.flowId
			}
		])
	}
}

const save = async () => {
	loading.value = true
	const savedFlow = await useApi('flowControl').post('api/flow/save', {
		body: {
			flowData: localFlow.value
		}
	})

	if (savedFlow.flowId) {
		const index = useAppStore().flowList.findIndex((flow) => flow.flowId === savedFlow.flowId)
		if (index !== -1) {
			useAppStore().flowList[index] = savedFlow
		} else {
			useAppStore().flowList.push(savedFlow)
		}
		useAppStore().flow = savedFlow
	}

	handleSaveSchedules()

	emit('save')
}

const validateFlow = computed(() => {
	return !localFlow.value.flowName || !validateCron.value
})

const validateCron = computed(() => {
	if (localFlow.value.cron) {
		try {
			cronstrue.toString(localFlow.value.cron)
			return true
		} catch {
			return false
		}
	}
	return true
})

const canDeleteFlow = computed(() => {
	return useAppStore().flowList.length > 1
})

const remove = async () => {
	loading.value = true
	await useApi().post('api/flow/remove', {
		body: {
			flowId: localFlow.value.flowId,
			appId: localFlow.value.appId
		}
	})

	handleSaveSchedules()

	useAppStore().flowList = useAppStore().flowList.filter((flow) => flow.flowId !== localFlow.value.flowId)
	emit('save')
}

const replicateFlow = async () => {
	loading.value = true
	const savedFlow = await useApi().post('api/flow/clone', {
		body: {
			flowId: localFlow.value.flowId,
			appId: localFlow.value.appId
		}
	})

	if (savedFlow && savedFlow.flowId) {
		useAppStore().flowList.push(savedFlow)
		useAppStore().flow = savedFlow
	}

	emit('save')
}

onMounted(() => {
	if (props.flow && props.flow.flowId) {
		localFlow.value = cloneDeep(props.flow as Partial<FlowType>)
	} else {
		localFlow.value = {
			cron: '',
			cronStatus: 'active',
			flowKey: '',
			flowOrder: 0,
			flowStart: 0,
			locked: false,
			appId: useAppStore().app.appId,
			flowId: null,
			flowName: '',
			flowDescription: '',
			flowType: 'dataPrep',
			workflow: {
				nodes: [],
				edges: []
			},
			options: {
				flowTimeout: 0,
				dashboardType: 'page',
				flowReload: undefined,
				dialogWidth: undefined,
				dialogOnDestroy: 'none'
			},
			cronBase: {
				status: 'active',
				every: undefined,
				current: '* * * * *',
				minuteValues: [],
				hourValues: [],
				dayValues: [],
				dayOfMonthValues: [],
				monthValues: []
			}
		}
	}

	backupSchedule.cron = localFlow.value.cron
	backupSchedule.cronStatus = localFlow.value.cronStatus
})
</script>
