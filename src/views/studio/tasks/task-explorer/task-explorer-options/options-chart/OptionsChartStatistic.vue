<template>
	<NCollapseItem name="statistic">
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="total" />
				{{ $t('statistic') }}
			</div>
		</template>
		<div class="options-chart-statistic control-secondary">
			<div class="control">
				<NCheckbox
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
					<NInput
						v-model:value="useReportStore().current.settings.statisticLabel"
						class="w-full"
					/>
				</div>
				<div class="control">
					<NCheckbox
						v-model:checked="useReportStore().current.settings.compactNumberStatistic"
						:label="$t('compactNumbersOfStatistic')"
						class="w-full"
					/>
				</div>
				<NDivider class="!my-3" />
			</template>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
