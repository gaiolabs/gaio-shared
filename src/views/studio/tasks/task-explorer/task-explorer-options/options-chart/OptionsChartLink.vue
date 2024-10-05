<template>
	<NCollapseItem
		:title="$t('link')"
		name="link"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="link" />
				{{ $t('link') }}
			</div>
		</template>
		<div class="options-chart-link control-secondary">
			<div class="control">
				<div class="control-label">{{ $t('flow') }}</div>
				<GSelectFlow v-model:value="useReportStore().current.settings.linkFlow" />
			</div>
		</div>
	</NCollapseItem>
</template>

<script setup lang="ts">
import GSelectFlow from '@/components/GSelectFlow.vue'
import { useReportStore } from '@/stores'
</script>
