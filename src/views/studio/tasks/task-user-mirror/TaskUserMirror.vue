<template>
	<g-dialog
		width="500px"
		@close="$emit('close')"
	>
		<template #title>{{ $t('taskUserMirror') }}</template>
		<template #content>
			<div class="task-user-mirror overflow-auto">
				<div class="control">
					<div class="control-label">{{ $t('resultTable') }}</div>
					<NInput
						v-model:value="localTask.resultTable"
						v-alpha
					/>
				</div>
				<div class="control-label">{{ $t('columns') }}</div>
				<NCard content-style="padding: 10px">
					<NCheckboxGroup v-model:value="localTask.fields">
						<NCheckbox
							:label="$t('name')"
							value="name"
						/>
						<NCheckbox
							:label="$t('email')"
							value="email"
						/>
						<NCheckbox
							:label="$t('createdAt')"
							value="createdAt"
						/>
						<NCheckbox
							:label="$t('group')"
							value="group"
						/>
						<NCheckbox
							:label="$t('role')"
							value="role"
						/>
					</NCheckboxGroup>
				</NCard>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<NButton
					type="primary"
					@click="save()"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { UserTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close'])

const localTask = ref<UserTaskType>({})
const loading = ref(false)

const save = () => {
	loading.value = true
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value,
			sources: [],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...localTask.value,
						label: localTask.value.resultTable,
						resultTable: localTask.value.resultTable
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'userMirror',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {})
		}
	})
})
</script>
