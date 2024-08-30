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
					<g-icon name="eye" />
				</NButton>
			</template>
			{{ $t('viewTable') }}
		</NTooltip>
	</div>
</template>
<script setup lang="ts">
import useBus from '@/composables/useBus'

defineProps<{ tableName: string }>()
</script>
