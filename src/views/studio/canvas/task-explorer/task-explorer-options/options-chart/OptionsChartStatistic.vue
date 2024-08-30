<template>
	<div class="options-chart-statistic control-secondary">
		<div class="control">
			<n-checkbox
				v-model:checked="useReportStore().current.settings.showStatistic"
				:label="$t('enable')"
				class="w-full"
			/>
		</div>
		<template v-if="useReportStore().current.settings.showStatistic">
			<div class="control">
				<div class="control-label">
					{{ $t('statisticLabel') }}
				</div>
				<n-input
					v-model:value="useReportStore().current.settings.statisticLabel"
					class="w-full"
				/>
			</div>
			<div class="control">
				<n-checkbox
					v-model:checked="useReportStore().current.settings.compactNumberStatistic"
					:label="$t('compactNumbersOfStatistic')"
					class="w-full"
				/>
			</div>
			<NDivider class="!my-3" />
		</template>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
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
