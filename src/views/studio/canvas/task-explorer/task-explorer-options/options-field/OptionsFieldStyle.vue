<template>
	<div class="options-field-style control-secondary">
		<div class="control">
			<div class="control-label">
				{{ $t('fontWeight') }}
			</div>
			<n-select
				v-model:value="useReportStore().currentField.fontWeight"
				:options="[
					{
						label: $t('fontThin'),
						value: '300'
					},
					{
						label: $t('fontNormal'),
						value: '400'
					},
					{
						label: $t('fontBold'),
						value: '700'
					}
				]"
			/>
		</div>
		<div class="control">
			<div class="control-label">{{ $t('align') }}</div>
			<n-select
				v-model:value="useReportStore().currentField.textAlign"
				:options="[
					{
						label: $t('left'),
						value: 'left'
					},
					{
						label: $t('right'),
						value: 'right'
					},
					{
						label: $t('center'),
						value: 'center'
					}
				]"
			/>
			<div class="control-label">{{ $t('fontSize') }}</div>
			<n-input-number
				v-model:value="useReportStore().currentField.fontSize"
				:min="6"
				:max="90"
				:label="$t('fontSize')"
			/>
		</div>

		<div class="control">
			<div class="control-label">{{ $t('fontColor') }}</div>
			<n-color-picker
				v-model:value="useReportStore().currentField.fontColor"
				:modes="['hex']"
			/>
		</div>

		<div class="control">
			<n-checkbox
				v-model:checked="useReportStore().currentField.noHeaderStyle"
				:label="$t('applyOnHeader')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
