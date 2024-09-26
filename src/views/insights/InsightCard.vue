<template>
	<g-card class="core-gradient insight-card g-border-500 max-w-[370px] rounded-[24px] backdrop-blur">
		<div :class="insightTheme">
			<div class="insight-color-primary mb-2 flex items-center justify-between">
				<div class="insight-color-primary text-sm">
					<template v-if="insight.reference === 'up'">
						<g-icon name="trendUp" />
						{{ $t('peakUp') }}
					</template>
					<template v-else>
						<g-icon name="trendDown" />
						{{ $t('peakDown') }}
					</template>
				</div>
				<div>
					<div>{{ insight.percentage }}%</div>
				</div>
			</div>
			<div class="mb-2 flex items-center gap-2 text-lg">
				<div class="font-bold">{{ insight.dimensionValue }}</div>
				<div class="text-sm font-thin">{{ insight.dimension }}</div>
			</div>
			<div class="insight-color-primary flex items-center gap-2 text-lg font-bold">
				{{ insight.currenMeasureValue }}
				<div class="font-thin text-white">{{ insight.measure }}</div>
			</div>
			<div class="insight-color-secondary mb-3 text-base font-thin">
				{{ insight.previousMeasureValue }}
				<small class="ms-1">{{ $t('previous') }}</small>
			</div>
			<div class="row mb-2 flex items-center justify-between gap-3 text-xs text-gray-500">
				<div>
					<IconComponent name="DataSources" />
					{{ insight.tableName }}
				</div>
				<div>
					<g-icon name="time" />
					{{ insight.created }}
				</div>
			</div>
		</div>
	</g-card>
</template>
<script setup lang="ts">
import type { InsightCardType } from '@gaio/shared/types'
import { computed } from 'vue'

const props = defineProps<{ insight: InsightCardType }>()

const insightTheme = computed(() => {
	if (props.insight.inverted) {
		return props.insight.reference === 'up' ? 'insight-danger' : 'insight-success'
	}
	return props.insight.reference === 'up' ? 'insight-success' : 'insight-danger'
})
</script>

<style lang="scss">
.insight-card {
	.insight-danger {
		.insight-color-primary {
			color: #fb222f;
		}
	}

	.insight-success {
		.insight-color-primary {
			color: #12b76a;
		}
	}
}
</style>
