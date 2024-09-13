<template>
	<div class="report-treemap">
		<div
			ref="id"
			class="size-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import { Treemap, type TreemapOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { orderBy } from 'lodash-es'
import { computed, nextTick, onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])

const props = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()
const { settings, firstMeasure, firstDimension, columnName, columnTitle } = useReportChartHelper(props.task, props.list)
const { formatValue } = useFormatValue()

const id = shallowRef()
const chart = shallowRef()
const localList = shallowRef([])

const measureTitle = computed(() => {
	return columnTitle(firstMeasure.value)
})

const measure = computed(() => {
	return props.task.schema.select.find((o) => o.type !== 'value')
})

const measureName = computed(() => {
	return columnName(firstMeasure.value)
})

const dimensionName = computed(() => {
	return columnName(firstDimension.value)
})

const dimensionTitle = computed(() => {
	return columnTitle(firstDimension.value)
})

const meta = computed(() => {
	const metadata = {}
	metadata[dimensionName.value] = {
		alias: dimensionTitle.value
	}
	metadata['name'] = {
		alias: dimensionTitle.value
	}
	metadata['value'] = {
		alias: measureTitle.value,
		formatter: (v: any) => {
			return formatValue(v, measure.value)
		}
	}
	metadata[measureName.value] = {
		alias: measureTitle.value,
		formatter: (v: any) => {
			return formatValue(v, measure.value)
		}
	}
	return metadata
})

const init = () => {
	const processData = () => {
		let sumValue = 0
		for (let d of localList.value) {
			sumValue += d[measureName.value]
			d.value = d[measureName.value]
			d.name = d[dimensionName.value]
		}
		return {
			name: 'root',
			value: sumValue,
			children: orderBy(localList.value, ['value'], ['desc'])
		}
	}
	const prepareData = processData()

	const options: TreemapOptions | any = {
		// ...helper.generic(prepareData),
		data: prepareData,
		autoFit: true,
		padding: 'auto',
		colorField: settings.value.colorFieldType === 'measure' ? 'value' : 'name',
		openDrillDown: false,
		hierarchyConfig: {
			sort: (a, b) => {
				return b - a
			}
		},
		label: {
			autoRotate: true,
			autoHide: true,
			rotate: settings.value.labelRotate,
			// position: settings.value.showLabelType,
			formatter: (v) => {
				v.measure = v['value']
				const value = formatValue(v['value'], {
					...measure,
					compactNumber: settings.value.compactNumberLabel
				})

				let text = []

				if (settings.value.showLabelDimension) {
					text.push(v[dimensionName.value])
				}

				if (settings.value.showLabelMeasure) {
					text.push(value)
				}

				return text.join('\n')
			}
		},
		meta: meta.value,
		color: settings.value.theme.colors,
		tooltip: {
			formatter: (v) => {
				v.measure = v['value']
				v.value = formatValue(v['value'], measure.value)
				return v
			}
		}
		// legend: helper.legend()
	}

	chart.value = new Treemap(id.value as HTMLElement, options)

	chart.value.render()
	// g.on('element:click', (ev) => helper.clickEvent(ev, this))
}

onMounted(() => {
	localList.value = props.list
	localList.value.map((o) => {
		const size =
			measure.value.dataType && measure.value.dataType.includes('Float') ? measure.value.columnLength || 2 : 2
		o[measureName.value] = Number(Number(o[measureName.value] || 0).toFixed(size))
		return o
	})
	nextTick(() => init())
})
</script>

<style lang="scss">
span.ring-guide-value {
	font-size: 1.3em !important;
}
</style>
