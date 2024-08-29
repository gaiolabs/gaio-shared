<template>
	<g-dialog
		width="500px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('runProcess') }}</template>
		<template #content>
			<div class="task-run-flow flex flex-col items-center justify-center gap-1 overflow-auto">
				<div class="control flex w-full flex-col gap-1">
					<label class="control-label">
						{{ $t('flow') }}
					</label>
					<n-select
						v-model:value="localTask.flowId"
						:options="flowListOptions"
						:placeholder="$t('selectFlow')"
						@update:value="defineLabel"
					/>
				</div>
				<div class="control flex w-full flex-col gap-1">
					<label class="control-label">
						{{ $t('task') }}
					</label>

					<n-input
						v-model:value="localTask.label"
						:placeholder="$t('taskLabel')"
					/>
				</div>

				<div class="mt-2 w-full rounded bg-blue-100 p-2 text-xs text-blue-900">
					{{ $t('runFlowWarning') }}
				</div>
				<div class="flex w-full flex-col items-start justify-start gap-1">
					<label
						class="font-semibold text-neutral-500"
						for="max-repeat"
					>
						{{ $t('maxRepeat') }}
					</label>
					<n-input-number
						v-model:value="localTask.loopSize"
						:placeholder="$t('runFlowLoopWarning')"
						clearable
						class="w-full"
					/>
				</div>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<n-button
					type="primary"
					:disabled="!isValid"
					@click="save()"
				>
					{{ $t('save') }}
				</n-button>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import useValidate from '@/composables/useValidate'
import { useAppStore } from '@/stores'
import type { FlowTaskType } from '@gaio/shared/types/tasks/flow.task.type'
import { computed, onBeforeMount, ref } from 'vue'

const emit = defineEmits(['close'])

const localTask = ref<FlowTaskType>()
const { flowList } = useAppStore()

const defineLabel = () => {
	if (!localTask.value.label) {
		localTask.value.label = flowList?.find((flow) => flow.flowId === localTask.value.flowId)?.flowName
	}
}

const isValid = computed(() => {
	return useValidate().isValid(localTask.value, {
		label: 'string|min:1',
		flowId: 'string|min:1'
	})
})

const flowListOptions = computed(() =>
	flowList?.map((items) => {
		return {
			label: items.flowName,
			value: items.flowId
		}
	})
)

const save = () => {
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value
		})
		.save()
		.then(() => emit('close'))
}

onBeforeMount(() => {
	localTask.value = useDefault({
		type: 'flow',
		base: useAppStore().baseTask('flow')
	})
})
</script>
