<template>
	<div class="task-form-setup h-full p-2">
		<div class="h-full rounded bg-paper-100 p-2 dark:bg-carbon-100">
			<n-tabs
				type="segment"
				animated
				size="small"
			>
				<n-tab-pane
					name="settings"
					:tab="$t('settings')"
				>
					<task-form-setup-setting />
				</n-tab-pane>
				<n-tab-pane
					name="types"
					:tab="$t('types')"
				>
					<task-form-setup-type />
				</n-tab-pane>
			</n-tabs>
		</div>
	</div>
</template>
<script setup lang="ts">
import TaskFormSetupSetting from '@/views/studio/canvas/task-form-builder/TaskFormSetupSetting.vue'
import TaskFormSetupType from '@/views/studio/canvas/task-form-builder/TaskFormSetupType.vue'
</script>
