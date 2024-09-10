<template>
	<div class="options-title control-secondary">
		<div class="control control-top flex flex-row pt-4">
			<NCheckbox
				v-model:checked="useReportStore().current.settings.headerBackgroundDark"
				:label="$t('headerBackgroundDark')"
				class="w-full"
			/>
			<NCheckbox
				v-model:checked="useReportStore().current.settings.showTable"
				:label="$t('showTableButton')"
				class="w-full"
			/>
		</div>
		<div class="control">
			<div class="control-label">
				{{ $t('messageHelper') }}
			</div>
			<NInput
				v-model:value="current.settings.description"
				type="textarea"
				:placeholder="$t('typeHelpMessageHere')"
			/>
		</div>
		<div class="control control-top">
			<div class="control-label">
				{{ $t('title') }}
			</div>
			<NInput
				v-model:value="current.settings.title"
				type="textarea"
				:placeholder="`${$t('typeTitleHere')}`"
			/>
		</div>
		<div class="control control-top">
			<div class="control-label">
				{{ $t('position') }}
			</div>
			<NSelect
				v-model:value="current.settings.titleAlign"
				:options="[
					{
						label: $t('left'),
						value: 'left'
					},
					{
						label: $t('center'),
						value: 'center'
					},
					{
						label: $t('right'),
						value: 'right'
					}
				]"
			/>
		</div>
		<div class="control">
			<div class="control-label">{{ $t('fontSize') }}</div>
			<NInputNumber v-model:value="current.settings.titleFontSize" />
		</div>
		<div class="control">
			<NCheckbox
				v-model:checked="current.settings.titleBold"
				:label="$t('bold')"
			/>
		</div>

		<div class="control">
			<div class="control-label">{{ $t('fontColor') }}</div>
			<NColorPicker
				v-model:value="current.settings.titleFontColor"
				:modes="['hex']"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
import { NCheckbox, NInput, NInputNumber, NSelect } from 'naive-ui'
const { current } = useReportStore()
</script>
