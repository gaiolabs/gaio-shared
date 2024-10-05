<template>
	<g-dialog @close="$emit('close')">
		<template #title>
			<div>
				<template v-if="localMeta.type === 'insights'">
					<g-icon name="insights" />
				</template>
				<template v-else>
					<g-icon name="power" />
				</template>
				<span class="ms-2">
					<template v-if="localMeta.type === 'insights'">{{ $t('taskInsights') }}</template>
					<template v-else>{{ $t('taskPowerSearch') }}</template>
				</span>
			</div>
		</template>
		<template #tabs>
			<div class="task-meta">
				<NTabs
					pane-class="g-bg-2"
					size="small"
					type="line"
				>
					<NTabPane
						name="1"
						:tab="$t('general')"
					>
						<div class="px-5 py-3">
							<div class="control flex items-center justify-between gap-3">
								<div class="flex-grow">
									<div class="control-label">{{ $t('label') }}</div>
									<NInput v-model:value="localMeta.label" />
								</div>
								<div class="flex-grow">
									<div class="control-label">{{ $t('tableName') }}</div>
									<g-select-table v-model="localMeta.tableName" />
								</div>
							</div>
							<div class="control">
								<div>
									<div class="control-label">{{ $t('description') }}</div>
									<NInput
										v-model:value="localMeta.description"
										type="textarea"
									/>
								</div>
							</div>
						</div>
					</NTabPane>
					<NTabPane
						v-if="localMeta.type === 'power'"
						name="2"
						:tab="$t('fields')"
					>
						<div class="px-5 py-4">
							<task-meta-fields :local-meta="localMeta" />
						</div>
					</NTabPane>
					<NTabPane
						v-if="localMeta.type === 'insights'"
						name="3"
						:tab="$t('options')"
					>
						<div class="px-5 py-4">
							<task-meta-insights
								v-if="localMeta.tableName"
								:local-meta="localMeta"
							/>
						</div>
					</NTabPane>
				</NTabs>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-between gap-2">
				<NSwitch
					v-model:value="localMeta.status"
					checked-value="active"
					unchecked-value="inactive"
				>
					<template #checked>
						{{ $t('active') }}
					</template>
					<template #unchecked>
						{{ $t('inactive') }}
					</template>
				</NSwitch>
				<NButton
					type="primary"
					:loading="loading"
					@click="saveMeta"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import TaskMetaFields from '@/views/studio/tasks/task-meta/TaskMetaFields.vue'
import TaskMetaInsights from '@/views/studio/tasks/task-meta/TaskMetaInsights.vue'
import type { MetaType } from '@gaio/shared/types/core/meta.type'
import { onBeforeMount, ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const localMeta = ref<MetaType>()
const loading = ref(false)

const saveMeta = async () => {
	loading.value = true
	await useApi().post('api/discovery/save-meta', {
		body: {
			metaData: localMeta.value
		}
	})
	loading.value = false

	emit('save')
}

onBeforeMount(() => {
	localMeta.value = useAppStore().cloneTask() || {}
})
</script>
