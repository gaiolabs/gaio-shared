<template>
	<div class="options-general">
		<NCheckbox
			v-model:checked="current.settings.showHeader"
			:label="$t('showCardHeader')"
		/>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
import { NCheckbox } from 'naive-ui'
const { current } = useReportStore()
</script>
