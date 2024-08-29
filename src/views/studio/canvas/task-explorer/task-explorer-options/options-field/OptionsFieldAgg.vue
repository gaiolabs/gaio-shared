<template>
	<div class="options-field-agg control-secondary">
		<n-radio-group
			v-model:value="useReportStore().currentField.type"
			name="options-field-agg"
			class="w-full"
		>
			<div
				v-for="agg in aggList"
				:key="agg.value"
				class="w-full"
			>
				<n-radio
					:key="agg.value"
					:value="agg.value"
					:label="agg.label"
					class="w-full"
				/>
			</div>
		</n-radio-group>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const aggList = [
	{
		value: 'value',
		label: t('dimension')
	},
	{
		value: 'none',
		label: t('noAggregated')
	},
	{
		value: 'avg',
		label: t('avg')
	},
	{
		value: 'count',
		label: t('count')
	},
	{
		value: 'sum',
		label: t('sum')
	},
	{
		value: 'max',
		label: t('max')
	},
	{
		value: 'min',
		label: t('min')
	},
	{
		value: 'avgDistinct',
		label: t('avgDistinct')
	},
	{
		value: 'countDistinct',
		label: t('countDistinct')
	},
	{
		value: 'sumDistinct',
		label: t('sumDistinct')
	},
	{
		value: 'stdDevPop',
		label: t('stdDevPop')
	},
	{
		value: 'stdDevSamp',
		label: t('stdDevSamp')
	},
	{
		value: 'sumPercent',
		label: t('sumPercent')
	},
	{
		value: 'countPercent',
		label: t('countPercent')
	}
]
</script>
