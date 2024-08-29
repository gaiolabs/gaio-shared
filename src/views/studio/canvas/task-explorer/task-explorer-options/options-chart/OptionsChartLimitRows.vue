<template>
	<div class="options-limit-rows control-secondary">
		<n-input-number
			v-model:value="useReportStore().current.settings.limitRows"
			:min="0"
			:step="1"
			:placeholder="$t('rows')"
		/>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
