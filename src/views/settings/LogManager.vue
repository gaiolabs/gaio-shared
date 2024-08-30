<template>
	<settings-view>
		<template #title>
			<div class="flex items-center gap-2">
				<g-icon
					name="settingsLogs"
					:height="22"
				/>
				{{ $t('log') }}
			</div>
		</template>
		<div>
			<NSpace vertical>
				<NDivider title-placement="left">
					{{ $t('Todo') }}
				</NDivider>
				<NSkeleton
					:height="30"
					class="rounded"
				/>
				<NSkeleton
					:height="90"
					class="rounded"
				/>
			</NSpace>
		</div>
	</settings-view>
</template>
<script setup lang="ts">
import SettingsView from '@/views/settings/SettingsView.vue'
import { NSkeleton } from 'naive-ui'
</script>
