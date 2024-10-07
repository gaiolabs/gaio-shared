<template>
	<div class="options-chart">
		<NTabs
			type="segment"
			animated
			size="small"
		>
			<NTabPane
				name="properties"
				:tab="$t('properties')"
			>
				<NScrollbar class="max-h-[85svh]">
					<NCollapse
						accordion
						arrow-placement="right"
						class="px-1"
					>
						<OptionsChartGeneral v-if="showGeneralOptions" />
						<OptionsHeader />
						<OptionsChartStatistic v-if="useReportStore().showOnlyIf(['pie'])" />
						<OptionsChartLegend v-if="useReportStore().hideOnlyIf(['gauge', 'sunburst', 'treemap', 'wordCloud'])" />
						<OptionsChartLabel v-if="useReportStore().hideOnlyIf(['wordCloud'])" />
						<OptionsChartXAxis v-if="showShowAxisOptions" />
						<OptionsChartYAxis v-if="showShowAxisOptions" />
						<OptionsChartGuideline v-if="useReportStore().showOnlyIf(['scatter', 'bubble'])" />
						<OptionsChartQuadrant v-if="useReportStore().showOnlyIf(['scatter', 'bubble'])" />
						<OptionsChartLink v-if="useReportStore().showOnlyIf([''])" />
						<OptionsChartMargin v-if="useReportStore().hideOnlyIf(['heatmap', 'calendar'])" />
						<OptionsChartLimitRows v-if="useReportStore().showOnlyIf(['table'])" />
						<OptionsRowsPerPage />
						<OptionsMessage />
					</NCollapse>
				</NScrollbar>
			</NTabPane>
			<NTabPane
				name="theme"
				:tab="$t('theme')"
			>
				<OptionsTheme class="mt-1" />
			</NTabPane>
		</NTabs>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import OptionsChartGeneral from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartGeneral.vue'
import OptionsChartLabel from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartLabel.vue'
import OptionsChartLegend from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartLegend.vue'
import OptionsChartLimitRows from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartLimitRows.vue'
import OptionsChartLink from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartLink.vue'
import OptionsChartMargin from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartMargin.vue'
import OptionsChartStatistic from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartStatistic.vue'
import OptionsChartXAxis from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartXAxis.vue'
import OptionsChartYAxis from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChartYAxis.vue'
import OptionsHeader from '@/views/studio/tasks/task-explorer/task-explorer-options/options-general/OptionsHeader.vue'
import OptionsMessage from '@/views/studio/tasks/task-explorer/task-explorer-options/options-general/OptionsMessage.vue'
import OptionsRowsPerPage from '@/views/studio/tasks/task-explorer/task-explorer-options/options-general/OptionsRowsPerPage.vue'
import OptionsTheme from '@/views/studio/tasks/task-explorer/task-explorer-options/options-general/OptionsTheme.vue'
import { NCollapse, NScrollbar, NTabPane, NTabs } from 'naive-ui'
import OptionsChartGuideline from './OptionsChartGuideline.vue'
import OptionsChartQuadrant from './OptionsChartQuadrant.vue'

const showGeneralOptions = computed(() =>
	useReportStore().showOnlyIf(['funnel', 'line', 'area', 'calendar', 'treemap']),
)

const showShowAxisOptions = computed(() =>
	useReportStore().showOnlyIf([
		'bar',
		'column',
		'forecast',
		'bullet',
		'combo',
		'stacked',
		'area',
		'line',
		'scatter',
		'bubble',
		'histogram',
		'dual',
		'heatmap',
	]),
)
</script>
