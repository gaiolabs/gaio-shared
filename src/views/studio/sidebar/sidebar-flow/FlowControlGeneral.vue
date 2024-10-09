<template>
	<div
		v-if="localFlow"
		id="flow-control-general"
	>
		<div class="control">
			<div class="control-label">{{ $t('processName') }}</div>
			<div>
				<NInput
					v-model:value="localFlow.flowName"
					:placeholder="$t('typeHere')"
				/>
			</div>
		</div>
		<div class="control">
			<div class="control-label">{{ $t('description') }}</div>
			<div>
				<NInput
					v-model:value="localFlow.flowDescription"
					type="textarea"
					:placeholder="$t('typeHere')"
				/>
			</div>
		</div>

		<div class="my-2 flex gap-2">
			<div>
				<div>
					{{ $t('type') }}
				</div>
				<NRadioGroup
					v-model:value="localFlow.flowType"
					name="flowType"
				>
					<NRadioButton
						value="infoPub"
						:label="$t('infoPub')"
					/>
					<NRadioButton
						value="dataPrep"
						:label="$t('dataPrep')"
					/>
				</NRadioGroup>
			</div>

			<div class="grow">
				<div>
					{{ $t('maxTimeExecution') }}
				</div>
				<NInputNumber v-model:value="localFlow.options.flowTimeout" />
			</div>
			<div>
				<div>
					{{ $t('lock') }}
				</div>
				<NSwitch
					v-model:value="localFlow.locked"
					:checked-value="true"
					:unchecked-value="false"
				/>
			</div>
		</div>
		<template v-if="localFlow.flowType === 'infoPub'">
			<div>{{ $t('dashboard') }} {{ $t('options').toLowerCase() }}</div>
			<div class="mb-3 flex gap-2 rounded border-elevation-1 bg-paper-100 p-2 dark:bg-carbon-200">
				<div class="grow">
					<div>
						{{ $t('type') }}
					</div>
					<NRadioGroup
						v-model:value="localFlow.options.dashboardType"
						name="dashboardType"
					>
						<NRadioButton
							value="page"
							:label="$t('dashboardAsPage')"
						/>
						<NRadioButton
							value="dialog"
							:label="$t('dashboardAsDialog')"
						/>
					</NRadioGroup>
				</div>
				<div class="grow">
					{{ $t('refreshDashboardEach') }}
					<NInputNumber v-model:value="localFlow.options.flowReload" />
				</div>
			</div>

			<template v-if="localFlow.options.dashboardType === 'dialog'">
				<div>{{ $t('dashboardAsDialog') }} {{ $t('options').toLowerCase() }}</div>
				<div class="mb-4 flex gap-2 rounded bg-paper-100 p-2 dark:bg-carbon-200">
					<div class="grow">
						{{ $t('dashboardDialogAfterClose') }}
						<NSelect
							v-model:value="localFlow.options.dialogOnDestroy"
							:options="
								['none', 'resetFlow', 'resetParams', 'resetParamsAndFlow'].map((o) => {
									return { label: $t(`dialog${capitalizeFirstLetter(o)}`), value: o }
								})
							"
						/>
					</div>

					<div class="grow">
						{{ $t('dialogWidth') }}
						<NInputNumber v-model:value="localFlow.options.dialogWidth" />
					</div>
				</div>
			</template>
		</template>

		<div
			v-if="localFlow.flowId"
			class="mb-4"
		>
			{{ $t('processKey') }}
			<NInput
				v-model:value="localFlow.flowKey"
				:disabled="true"
			>
				<template #suffix>
					<NButton
						size="tiny"
						:loading="loading"
						text
						@click="renewFlowKey"
					>
						<g-icon name="refresh" />
					</NButton>
				</template>
			</NInput>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { FlowType } from '@gaio/shared/types'
import { ref } from 'vue'

const { localFlow = null } = defineProps<{ localFlow: FlowType }>()

const loading = ref(false)

const renewFlowKey = async () => {
	loading.value = true
	const savedFlow = await useApi().post('api/flow/renew-flow-key', {
		body: {
			flowId: localFlow.flowId,
			appId: localFlow.appId,
		},
	})

	loading.value = false
	localFlow.flowKey = savedFlow.flowKey
}

const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
