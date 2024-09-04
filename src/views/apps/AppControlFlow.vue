<template>
	<div
		v-if="localApp"
		class="app-control-flow px-4"
	>
		<div class="my-2">
			<div>{{ $t('firstFlowAtStudio') }}</div>
			<NSelect
				v-model:value="localApp.options.studioFlowStart"
				:options="flowList"
			/>
		</div>

		<div
			v-if="!loading && flowList.length"
			class="mb-2"
		>
			<div>
				{{ $t('dashboard') }}
			</div>

			<div>
				<NList
					size="small"
					bordered
				>
					<drag
						:list="flowList"
						@change="updateFlowOrder"
					>
						<NListItem
							v-for="flow of flowList"
							:key="flow.value"
						>
							<div class="flex items-center gap-2">
								<div>
									<g-icon
										v-if="flow.flowType === 'infoPub'"
										name="dashboard"
									/>
									<g-icon
										v-else
										name="dashboard"
									/>
								</div>
								<div>{{ flow.label }} - {{ flow.value }}</div>
							</div>
						</NListItem>
					</drag>
				</NList>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { AppType, FlowType } from '@gaio/shared/types'
import { NList } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { VueDraggableNext as Drag } from 'vue-draggable-next'

const { localApp = null } = defineProps<{ localApp: AppType }>()

const loading = ref(false)

const flowList = ref<{ label: string; value: string; [key: string]: unknown }[]>([])

const loadFlow = async () => {
	loading.value = true
	const { post } = useApi()
	flowList.value = await post('api/flow/list', {
		body: {
			appId: props.localApp.appId
		}
	}).then((res: FlowType[]) =>
		res.map((item) => ({
			label: item.flowName,
			value: item.flowId,
			flowType: item.flowType
		}))
	)
	loading.value = false
}

const updateFlowOrder = () => {
	useApi().post('api/flow/update-order', {
		body: {
			appId: props.localApp.appId,
			flowList: flowList.value.map((item) => item.value)
		}
	})
}

onMounted(() => {
	loadFlow()
})
</script>
