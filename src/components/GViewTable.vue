<template>
	<div class="g-view-table">
		<NTooltip
			:persistent="false"
			:show-after="1500"
			:content="$t('viewTable')"
		>
			<template #trigger>
				<NButton
					text
					:underline="false"
					@click="useBus.emit('openTable', tableName)"
				>
					<GIcon name="eye" />
				</NButton>
			</template>
			{{ $t('viewTable') }}
		</NTooltip>
	</div>
</template>
<script setup lang="ts">
import useBus from '@/composables/useBus'
import { NButton, NTooltip } from 'naive-ui'
import GIcon from './GIcon.vue'

defineProps<{ tableName: string }>()
</script>
