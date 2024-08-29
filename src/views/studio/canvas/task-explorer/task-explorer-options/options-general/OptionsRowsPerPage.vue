<template>
	<div class="options-rows-per-page control-secondary">
		<n-input-number
			v-model:value="useReportStore().current.settings.pageSize"
			:min="0"
			:step="1"
			:placeholder="$t('rows')"
		>
			<template #prefix>
				<g-icon name="table" />
			</template>
		</n-input-number>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
