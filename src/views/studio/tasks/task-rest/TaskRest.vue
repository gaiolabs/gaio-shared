<template>
	<GDialog @close="emit('close')">
		<template #title>
			<task-icon :local-task="localTask" />
			{{ $t('taskRest') }}
		</template>
		<template #content>
			<div
				v-if="localTask"
				id="task-rest"
				class="flex flex-col gap-4"
			>
				<div class="grid gap-2 grid-cols-2">
					<label>
						<span>
							{{ $t('task') }}
						</span>
						<NInput v-model:value="localTask.label" />
					</label>

					<label class="control-label">
						<span>
							{{ $t('table') }}
						</span>
						<NInput
							v-model:value="localTask.tableName"
							v-alpha
							disabled
						/>
					</label>
				</div>

				<GTabs v-model="currentTab">
					<GTab
						name="general"
						:label="$t('general')"
					>
						<TaskRestGeneral :local-task="localTask" />
					</GTab>
					<GTab
						name="basicAuth"
						:label="$t('basicAuth')"
					>
						<TaskRestBasicAuth :local-task="localTask" />
					</GTab>
					<GTab
						name="headers"
						:label="$t('headers')"
					>
						<TaskRestHeaders :local-task="localTask" />
					</GTab>
					<GTab
						name="result"
						:label="$t('result')"
					>
						<TaskRestResult :local-task="localTask" />
					</GTab>
					<GTab
						name="errorLog"
						:label="$t('errorLog')"
					>
						<TaskRestErrorLog :local-task="localTask" />
					</GTab>
				</GTabs>

				<!-- <NTabs
					pane-class="bg-elevation-1"
					size="small"
					type="line"
					:default-value="currentTab"
				>
					<NTabPane
						name="general"
						:tab="$t('general')"
					>
						<task-rest-general :local-task="localTask" />
					</NTabPane>
					<NTabPane
						name="basicAuth"
						:tab="$t('basicAuth')"
						display-directive="show:lazy"
					>
						<task-rest-basic-auth :local-task="localTask" />
					</NTabPane>
					<NTabPane
						name="headers"
						:tab="$t('headers')"
					>
						<task-rest-headers :local-task="localTask" />
					</NTabPane>
					<NTabPane
						name="result"
						:tab="$t('result')"
					>
						<task-rest-result :local-task="localTask" />
					</NTabPane>
					<NTabPane
						name="errorLog"
						:tab="$t('errorLog')"
					>
						<task-rest-error-log :local-task="localTask" />
					</NTabPane>
				</NTabs> -->
			</div>
		</template>
		<template #footer>
			<div class="flex justify-between">
				<GButton
					type="secondary"
					@click="$emit('close')"
				>
					{{ $t('cancel') }}
				</GButton>
				<GButton
					type="primary"
					@click="save()"
				>
					{{ $t('save') }}
				</GButton>
			</div>
		</template>
	</GDialog>
</template>
<script setup lang="ts">
import GTab from '@/components/inputs/GTab.vue'
import GTabs from '@/components/inputs/GTabs.vue'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { RestTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'
import TaskRestBasicAuth from './TaskRestBasicAuth.vue'
import TaskRestErrorLog from './TaskRestErrorLog.vue'
import TaskRestGeneral from './TaskRestGeneral.vue'
import TaskRestHeaders from './TaskRestHeaders.vue'
import TaskRestResult from './TaskRestResult.vue'

const emit = defineEmits(['close'])

const localTask = ref<RestTaskType>()
const currentTab = ref('general')
// const headersRef = ref(localTask.value?.headers)

const save = () => {
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value,
			sources: [
				useDefault({
					type: 'table',
					base: {
						...useAppStore().appInfo,
						...localTask.value,
					},
				}),
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...localTask.value,
						label: localTask.value.resultTable,
						tableName: localTask.value.resultTable,
					},
				}),
			],
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'rest',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask(),
		},
	})
	console.log(localTask.value)
})
</script>
