<template>
	<div class="options-chart-link control-secondary">
		<div class="control">
			<div class="control-label">{{ $t('flow') }}</div>
			<g-select-flow v-model:value="useReportStore().current.settings.linkFlow" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'

defineProps<{
	hideColor?: boolean
}>()
</script>
