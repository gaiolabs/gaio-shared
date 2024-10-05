<template>
	<div class="task-form-setup h-full p-2">
		<div class="h-full rounded bg-paper-100 p-2 dark:bg-carbon-100">
			<NTabs
				type="segment"
				animated
				size="small"
			>
				<NTabPane
					name="settings"
					:tab="$t('settings')"
				>
					<task-form-setup-setting />
				</NTabPane>
				<NTabPane
					name="types"
					:tab="$t('types')"
				>
					<task-form-setup-type />
				</NTabPane>
			</NTabs>
		</div>
	</div>
</template>
<script setup lang="ts">
import TaskFormSetupSetting from '@/views/studio/tasks/task-form-builder/TaskFormSetupSetting.vue'
import TaskFormSetupType from '@/views/studio/tasks/task-form-builder/TaskFormSetupType.vue'
</script>
