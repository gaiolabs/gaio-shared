<template>
	<NTag
		:class="classBasedOnType"
		class="v-tag"
	>
		<div class="flex w-full items-center justify-center gap-1">
			<GIcon
				v-if="showIcon"
				:name="iconName"
			/>
			{{ title }}
		</div>
	</NTag>
</template>

<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import type { FieldType } from '@gaio/shared/types'
import { NTag } from 'naive-ui'
import { computed } from 'vue'
import GIcon from './GIcon.vue'

const { dataTypeIsNumeric, dataTypeIcon, dataTypeIsDate } = useDataType()

const {
	field,
	showIcon = true,
	selected = false,
	isForGaugeChart = false,
	isMeasure = false,
	position = 0,
} = defineProps<{
	field: FieldType
	showIcon?: boolean
	selected?: boolean
	isForGaugeChart?: boolean
	isMeasure?: boolean
	position?: number
}>()

const iconName = computed(() => {
	return dataTypeIcon(field.dataType)
})

const classBasedOnType = computed(() => {
	if (selected) {
		return 'color-computed'
	}

	const col = field
	if (col.content) {
		return 'color-computed'
	} else if (dataTypeIsDate(col.dataType)) {
		return 'color-date'
	} else if (dataTypeIsNumeric(col.dataType)) {
		return 'color-numeric'
	} else {
		return 'color-text'
	}
})

const title = computed(() => {
	let tagTitle = field.alias || field.columnName
	if (isForGaugeChart) {
		if (isMeasure) {
			if (position === 0) tagTitle = 'Min: ' + tagTitle
			else if (position === 1) tagTitle = 'Max: ' + tagTitle
			else if (position === 2) tagTitle = 'Target: ' + tagTitle
		}
	}
	return tagTitle
})
</script>

<style lang="scss">
.v-tag {
	.n-tag__border {
		border: none !important;
	}

	&.color-text {
		color: #00718c;
		background: #e5f1f3;
		border: 1px solid #acd1d9;
		border-radius: 6px;
	}

	&.color-numeric {
		border-radius: 6px;
		border: 1px solid rgba(251, 34, 47, 0.25);
		background: rgba(204, 0, 12, 0.1);
		color: #cc000c;
	}

	&.color-computed {
		border-radius: 6px;
		border: 1px solid #1f1f1f;
		background: #fff;
		color: #1f1f1f;
	}

	&.color-date {
		border-radius: 6px;
		border: 1px solid rgba(153, 83, 0, 0.25);
		background: rgba(153, 83, 0, 0.1);
		color: #995300;
	}

	&.color-selected {
		border-radius: 6px;
		border: 1px solid #1f1f1f;
		background: #fff;
		color: #1f1f1f;
	}
}
</style>
