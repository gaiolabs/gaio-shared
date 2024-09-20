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
import useReportChartHelper from './ReportChartHelperGplot'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const {
	settings,
	firstMeasure,
	firstDimension,
	secondDimension,
	meta,
	dimensions,
	measures,
	columnName,
	processedList,
	legend
} = useReportChartHelper(task, list)

const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()

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

const getOptions = (): PieOptions => {
	return {
		animation: false,
		data: processedList('pie'),
		colorField: columnName(firstDimension.value),
		angleField: columnName(firstMeasure.value),
		radius: 1,
		innerRadius: null,
		meta: meta.value,
		autoFit: true,
		padding: 'auto',
		color: settings.value.theme.colors,
		legend: legend(),
		label:
			settings.value.showLabel ?
				{
					type: labelPosition.value || 'spider',
					autoRotate: true,

					style: {
						lineWidth: 0,
						fontSize: Number(settings.value.labelFontSize || 11),
						fill: settings.value.labelFontColor
					},
					labelHeight: 60,
					content: (v) => {
						let text = []
						if (settings.value.showLabelDimension) {
							if (dimensions.value.length > 1)
								text.push(`${v[columnName(firstDimension.value)]} - ${v[columnName(secondDimension.value)]}`)
							else text.push(v[columnName(firstDimension.value)])
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
		statistic: null,
		interactions: [{ type: 'element-selected' }]
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Pie(id.value as HTMLElement, getOptions())
	chart.value.render()
}

watch(
	[() => task, () => list, dimensions, measures],
	() => {
		chart.value.update(getOptions())
	},
	{ deep: true }
)

onMounted(() => {
	nextTick(() => loadChart())
})
</script>
