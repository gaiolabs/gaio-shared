<template>
	<div class="report-pie">
		<div
			ref="id"
			class="size-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import { Pie, type PieOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const props = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { settings, firstMeasure, firstDimension, meta, columnName, appendPadding } = useReportChartHelper(props.task)
const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()
const localList = shallowRef([])

const labelPosition = computed(() => {
	switch (settings.value.showLabelType) {
		case 'top':
			return 'outer'
		case 'bottom':
			return 'spider'
		default:
			return 'inner'
	}
})

const loadChart = () => {
	chart.value = new Pie(
		id.value as HTMLElement,
		{
			animation: false,
			data: localList.value,
			colorField: columnName(firstDimension.value),
			angleField: columnName(firstMeasure.value),
			radius: 1,
			innerRadius: settings.value.pieDonut ? null : settings.value.innerRadius || 0.72,
			meta: meta.value,
			autoFit: true,
			padding: 'auto',
			appendPadding: appendPadding(),
			color: settings.value.theme.colors,
			label:
				settings.value.showLabel ?
					{
						type: labelPosition.value || 'spider',
						autoRotate: true,
						autoHide: true,
						style: {
							lineWidth: 0,
							fontSize: Number(settings.value.labelFontSize || 11),
							fill: settings.value.labelFontColor
						},
						labelHeight: 60,
						content: (v) => {
							let text = []

							if (settings.value.showLabelDimension) {
								text.push(v[columnName(firstDimension.value)])
							}

							if (settings.value.showLabelMeasure) {
								let value = v['measure'] || v[columnName(firstMeasure.value)]

								value = formatValue(value, {
									...firstMeasure.value,
									compactNumber: settings.value.compactNumberLabel
								})

								text.push(value)
							}

							if (settings.value.showLabelPercent) {
								text.push((v.percent * 100).toFixed(2) + '%')
							}

							return text.join('\n')
						}
					}
				:	null,
			statistic:
				!settings.value.pieDonut && settings.value.showStatistic ?
					{
						title:
							settings.value.statisticLabel ?
								{
									offsetY: -4,
									customHtml: () => {
										return settings.value.statisticLabel
									},
									style: {
										fontSize: Number(settings.value.statisticFontSize || 20) + 'px',
										fill: settings.value.statisticFontColor || '#333',
										whiteSpace: 'pre-wrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}
								}
							:	false,
						content: {
							offsetY: 4,
							style: {
								fontSize: Number(settings.value.statisticFontSize || 20) + 'px',
								fill: settings.value.statisticFontColor || '#333',
								whiteSpace: 'pre-wrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							},
							formatter: (datum, data) =>
								datum ?
									`${formatValue(datum[columnName(firstMeasure.value)], {
										...firstMeasure.value,
										compactNumber: settings.value.compactNumberStatistic
									})}`
								:	`${formatValue(
										data.reduce((r, d) => r + d[columnName(firstMeasure.value)], 0),
										{
											...firstMeasure.value,
											compactNumber: settings.value.compactNumberStatistic
										}
									)}`
						}
					}
				:	null,
			interactions: [{ type: 'element-selected' }]
		} as PieOptions
	)
	chart.value.render()
}

onMounted(() => {
	localList.value = props.list
	nextTick(() => loadChart())
})
</script>
