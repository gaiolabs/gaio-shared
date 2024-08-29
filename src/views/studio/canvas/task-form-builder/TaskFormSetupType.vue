<template>
	<div class="task-form-setup-type py-2">
		<div ref="gridBase">
			<div class="mb-2 flex items-center justify-start gap-2 rounded border bg-paper-200 px-2 py-2 dark:bg-carbon-200">
				<div>
					<g-icon name="grid" />
				</div>
				<div>
					{{ $t('grid') }}
				</div>
			</div>
		</div>

		<n-divider />

		<n-grid
			ref="elementBase"
			:cols="2"
			:x-gap="6"
			:y-gap="6"
		>
			<n-grid-item
				v-for="item of tools"
				:key="item.value"
			>
				<div class="flex items-center justify-start gap-2 rounded border bg-paper-200 px-2 py-2 dark:bg-carbon-200">
					<div>
						<g-icon :name="item.icon" />
					</div>
					<div>
						{{ item.label }}
					</div>
				</div>
			</n-grid-item>
		</n-grid>
	</div>
</template>
<script setup lang="ts">
import useDefaultFormField from '@/composables/useDefaultFormField'
import type { FormElementsType, FormFieldType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type BaseTool = {
	label: string
	value: string
	icon: string
	default: FormFieldType
}

type GridTool = {
	label: string
	value: string
	icon: string
	default: FormElementsType
}

const tools = ref<Array<BaseTool>>([
	{
		label: t('lineText'),
		value: 'lineText',
		icon: 'lineText',
		default: useDefaultFormField({ type: 'lineText', source: 'static' })
	},
	{
		label: t('lineNumber'),
		value: 'lineNumber',
		icon: 'lineNumber',
		default: useDefaultFormField({ type: 'lineNumber', source: 'static' })
	},
	{
		label: t('inputRadio'),
		value: 'radio',
		icon: 'inputRadio',
		default: useDefaultFormField({
			type: 'radio',
			source: 'list',
			list: [{ value: t('value'), label: t('label') }]
		})
	},
	{
		label: t('inputCheckbox'),
		value: 'checkbox',
		icon: 'inputCheckbox',
		default: useDefaultFormField({
			type: 'checkbox',
			source: 'list',
			list: [{ value: t('value'), label: t('label') }]
		})
	},
	{
		label: t('inputSelect'),
		value: 'select',
		icon: 'inputSelect',
		default: useDefaultFormField({
			type: 'select',
			source: 'list',
			list: [{ value: t('value'), label: t('label') }]
		})
	},
	{
		label: t('inputDate'),
		value: 'date',
		icon: 'inputDate',
		default: useDefaultFormField({ type: 'date' })
	},
	{
		label: t('inputDatetime'),
		value: 'datetime',
		icon: 'inputDatetime',
		default: useDefaultFormField({ type: 'datetime' })
	},
	{
		label: t('inputTime'),
		value: 'time',
		icon: 'inputTime',
		default: useDefaultFormField({ type: 'time' })
	},
	{
		label: t('inputSlider'),
		value: 'slider',
		icon: 'inputSlide',
		default: useDefaultFormField({
			type: 'slider',
			sliderMinValue: 0,
			sliderMaxValue: 100,
			sliderStepValue: 1,
			sliderShowStops: true
		})
	},
	{
		label: t('inputSlider') + ' ' + t('monthly'),
		value: 'slider',
		icon: 'inputSlide',
		default: useDefaultFormField({
			type: 'slider',
			sliderType: 'monthly',
			sliderMinValue: 1,
			sliderMaxValue: 12,
			sliderStepValue: 1,
			sliderShowStops: true
		})
	},
	{
		label: t('description'),
		value: 'description',
		icon: 'description',
		default: useDefaultFormField({ type: 'description' })
	},
	{
		label: t('divider'),
		value: 'divider',
		icon: 'divider',
		default: useDefaultFormField({ type: 'divider' })
	}
])

const gridList = ref<GridTool[]>([
	{
		label: t('grid'),
		value: 'grid',
		icon: 'grid',
		default: {
			id: undefined,
			cols: {
				[getId()]: []
			}
		}
	}
])

const elementBase = ref()
const gridBase = ref()

useDraggable(elementBase, tools, {
	animation: 150,
	group: {
		name: 'fields',
		pull: 'clone',
		put: false
	},
	sort: false,
	clone(element) {
		element = cloneDeep(element)
		element.default.id = getId()
		return element.default as BaseTool & FormFieldType
	}
})

useDraggable(gridBase, gridList, {
	animation: 150,
	group: {
		name: 'grid',
		pull: 'clone',
		put: false
	},
	sort: false,
	clone(element) {
		element = cloneDeep(element)
		element.default.id = getId()
		return element.default as GridTool & FormElementsType
	}
})
</script>
