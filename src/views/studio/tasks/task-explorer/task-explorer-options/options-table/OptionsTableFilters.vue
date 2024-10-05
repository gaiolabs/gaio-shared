<template>
	<div class="control-secondary">
		<NCheckbox
			v-model:checked="current.settings.showFilter"
			:label="$t('showSearch')"
			class="w-full"
		/>
		<NCheckbox
			v-model:checked="current.settings.showPoint"
			:label="$t('showOrder')"
			class="w-full"
		/>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'

const { current } = useReportStore()
</script>
