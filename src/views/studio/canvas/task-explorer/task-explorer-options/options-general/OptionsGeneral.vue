<template>
	<div class="options-general">
		<n-checkbox
			v-model:checked="current.settings.showHeader"
			:label="$t('showCardHeader')"
		/>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
const { current } = useReportStore()
</script>
