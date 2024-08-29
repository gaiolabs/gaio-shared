<template>
	<div
		v-if="localFlow"
		class="flow-control-general px-4"
	>
		<div class="control">
			<div class="control-label">{{ $t('processName') }}</div>
			<div>
				<n-input
					v-model:value="localFlow.flowName"
					:placeholder="$t('typeHere')"
				/>
			</div>
		</div>
		<div class="control">
			<div class="control-label">{{ $t('description') }}</div>
			<div>
				<n-input
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
				<n-radio-group
					v-model:value="localFlow.flowType"
					name="flowType"
				>
					<n-radio-button
						value="infoPub"
						:label="$t('infoPub')"
					/>
					<n-radio-button
						value="dataPrep"
						:label="$t('dataPrep')"
					/>
				</n-radio-group>
			</div>

			<div class="grow">
				<div>
					{{ $t('maxTimeExecution') }}
				</div>
				<n-input-number v-model:value="localFlow.options.flowTimeout" />
			</div>
			<div>
				<div>
					{{ $t('lock') }}
				</div>
				<n-switch
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
					<n-radio-group
						v-model:value="localFlow.options.dashboardType"
						name="dashboardType"
					>
						<n-radio-button
							value="page"
							:label="$t('dashboardAsPage')"
						/>
						<n-radio-button
							value="dialog"
							:label="$t('dashboardAsDialog')"
						/>
					</n-radio-group>
				</div>
				<div class="grow">
					{{ $t('refreshDashboardEach') }}
					<n-input-number v-model:value="localFlow.options.flowReload" />
				</div>
			</div>

			<template v-if="localFlow.options.dashboardType === 'dialog'">
				<div>{{ $t('dashboardAsDialog') }} {{ $t('options').toLowerCase() }}</div>
				<div class="mb-4 flex gap-2 rounded bg-paper-100 p-2 dark:bg-carbon-200">
					<div class="grow">
						{{ $t('dashboardDialogAfterClose') }}
						<n-select
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
						<n-input-number v-model:value="localFlow.options.dialogWidth" />
					</div>
				</div>
			</template>
		</template>

		<div
			v-if="localFlow.flowId"
			class="mb-4"
		>
			{{ $t('processKey') }}
			<n-input
				v-model:value="localFlow.flowKey"
				:disabled="true"
			>
				<template #suffix>
					<n-button
						size="tiny"
						:loading="loading"
						text
						@click="renewFlowKey"
					>
						<g-icon name="refresh" />
					</n-button>
				</template>
			</n-input>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { FlowType } from '@gaio/shared/types'
import { ref } from 'vue'

const props = withDefaults(defineProps<{ localFlow: FlowType }>(), {
	localFlow: null
})

const loading = ref(false)

const renewFlowKey = async () => {
	loading.value = true
	const savedFlow = await useApi().post('api/flow/renew-flow-key', {
		body: {
			flowId: props.localFlow.flowId,
			appId: props.localFlow.appId
		}
	})

	loading.value = false
	props.localFlow.flowKey = savedFlow.flowKey
}

const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
