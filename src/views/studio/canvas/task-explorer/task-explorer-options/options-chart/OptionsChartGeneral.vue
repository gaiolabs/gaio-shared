<template>
	<div class="options-chart-general control-secondary">
		<NCheckbox
			v-if="useReportStore().showOnlyIf(['funnel'])"
			v-model:checked="useReportStore().current.settings.transposed"
			:label="$t('transposed')"
			class="w-full"
		/>
		<template v-if="useReportStore().showOnlyIf(['line', 'area'])">
			<NDivider class="!my-3" />
			<NCheckbox
				v-model:checked="useReportStore().current.settings.showPoint"
				:label="$t('showPoint')"
				class="w-full"
			/>
			<NCheckbox
				v-model:checked="useReportStore().current.settings.lineSmooth"
				:label="$t('lineSmooth')"
				class="w-full"
			/>
		</template>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import { NCheckbox, NDivider } from 'naive-ui'
</script>

<style lang="scss">
.options-chart-general {
	.n-collapse-item {
		margin-left: 0 !important;
	}

	.n-collapse-item__header-main {
		display: flex;
		justify-content: flex-start;
	}
}
</style>
