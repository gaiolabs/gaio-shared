<template>
	<settings-view>
		<template #title>
			<div class="flex items-center gap-2">
				<g-icon
					name="monit"
					:height="22"
				/>
				{{ $t('monit') }}
			</div>
		</template>
		<div>
			<NSpace vertical>
				<NDivider title-placement="left">
					{{ $t('Todo') }}
				</NDivider>
				<n-skeleton
					:height="30"
					class="rounded"
				/>
				<n-skeleton
					:height="90"
					class="rounded"
				/>
			</NSpace>
		</div>
	</settings-view>
</template>
<script setup lang="ts">
import SettingsView from '@/views/settings/SettingsView.vue'
</script>
