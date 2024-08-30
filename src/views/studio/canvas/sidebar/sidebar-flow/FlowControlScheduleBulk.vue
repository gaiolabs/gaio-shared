<template>
	<div class="flow-control-schedule-bulk">
		<g-dialog @close="$emit('close')">
			<template #title>
				<div>
					{{ $t('scheduleBulkEdit') }}
				</div>
			</template>
			<template #content>
				{{ $t('flow') }}
				<n-select
					v-model:value="selectedFlowId"
					filterable
					:render-label="renderLabel"
					:options="flowListOptions"
					@update:value="onFlowChange($event)"
				/>

				<cron-base
					v-if="currentFlow"
					:key="currentFlow.flowId"
					class="mt-4"
					:cron-base="currentFlow.cronBase"
					@change="updateCurrentFlow($event)"
				/>
			</template>
			<template #footer>
				<div class="flex justify-end">
					<NSpace>
						<NButton
							secondary
							@click="$emit('close')"
						>
							{{ $t('close') }}
						</NButton>
						<NButton
							tertiary
							:loading="loading"
							type="error"
							@click="saveAll('inactive')"
						>
							{{ $t('disableAll') }}
						</NButton>
						<NButton
							:loading="loading"
							type="primary"
							tertiary
							@click="saveAll('active')"
						>
							{{ $t('activeAll') }}
						</NButton>
						<NButton
							:loading="loading"
							type="primary"
							@click="saveAll(undefined)"
						>
							{{ $t('saveModified') }}
						</NButton>
					</NSpace>
				</div>
			</template>
		</g-dialog>
	</div>
</template>

<script setup lang="ts">
import VIcon from '@/components/GIcon.vue'
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import type { CronBaseType, FlowType } from '@gaio/shared/types'
import { NButton } from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'

defineEmits(['close'])

const selectedFlowId = ref('')
const currentFlow = ref<FlowType | null>(null)
const loading = ref(false)
const flowList = useAppStore().flowList
const flowListOptions = useAppStore().flowList.map((o) => {
	return {
		label: o.flowName,
		value: o.flowId
	}
})

const onFlowChange = (flowId: string) => {
	currentFlow.value = flowList.find((o) => o.flowId === flowId)
}

const updateCurrentFlow = (cronBase: CronBaseType) => {
	flowList.forEach((o, index) => {
		if (o.flowId === currentFlow.value.flowId) {
			flowList[index].cronBase = cronBase
		}
	})
}

const saveAll = async (cronStatus: string | undefined) => {
	loading.value = true
	for (const flow of flowList) {
		flow.cronBase = {
			...flow.cronBase,
			status: ['active', 'inactive'].includes(cronStatus) ? flow.cronBase.status : 'inactive'
		}
		flow.cron = flow.cronBase.current
		flow.cronStatus = flow.cronBase.status
		await useApi('flowControlSchedule').post('api/flow/save', {
			body: {
				flowData: {
					flowId: flow.flowId,
					appId: flow.appId,
					cronBase: flow.cronBase
				}
			}
		})
	}
	loading.value = false
}

const flowWithCronActive = computed(() => {
	return flowList.filter((o) => o.cronBase.status === 'active').map((o) => o.flowId)
})

const renderLabel = (option) => {
	return h(
		'div',
		{
			style: {
				display: 'flex',
				alignItems: 'center',
				gap: '4px'
			}
		},
		[
			flowWithCronActive.value.includes(option.value) ?
				h(VIcon, {
					color: '#43a12e',
					name: 'calendarOn'
				})
			:	h(VIcon, {
					name: 'calendarOff',
					color: '#e32'
				}),
			h('span', null, option.label)
		]
	)
}

onMounted(() => {
	selectedFlowId.value = flowList[0].flowId
	currentFlow.value = flowList[0]
})
</script>
