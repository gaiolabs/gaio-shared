<template>
	<div class="options-title control-secondary">
		<n-input
			v-model:value="current.settings.title"
			type="textarea"
			:placeholder="`${$t('parameterPermitted')}`"
		/>
		<div class="control control-top">
			<div class="control-label">
				{{ $t('position') }}
			</div>
			<n-select
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
			<n-input-number v-model:value="current.settings.titleFontSize" />
		</div>
		<div class="control">
			<n-checkbox
				v-model:checked="current.settings.titleBold"
				:label="$t('bold')"
			/>
		</div>

		<div class="control">
			<div class="control-label">{{ $t('fontColor') }}</div>
			<n-color-picker
				v-model:value="current.settings.titleFontColor"
				:modes="['hex']"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
const { current } = useReportStore()
</script>
