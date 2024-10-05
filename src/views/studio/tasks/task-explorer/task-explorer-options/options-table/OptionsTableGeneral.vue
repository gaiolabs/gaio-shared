<template>
	<div class="control-secondary">
		<NCheckbox
			v-model:checked="current.settings.showHeader"
			:label="$t('showCardHeader')"
			class="w-full"
		/>
		<NCheckbox
			v-model:checked="current.settings.groupEqualCategory"
			:label="$t('groupDuplicatedDimensions')"
			class="w-full"
		/>
		<NCheckbox
			v-model:checked="current.settings.showRows"
			:label="$t('showRows')"
			class="w-full"
		/>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'

const { current } = useReportStore()
</script>
