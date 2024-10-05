<template>
	<div class="control-secondary">
		<div>
			<NCheckbox
				v-if="current.reportType === 'table'"
				v-model:checked="current.settings.downloadData"
				:label="$t('enable')"
			/>
		</div>
		<div
			v-if="current.settings.downloadData || current.reportType === 'download'"
			class="control control-label mt-2"
		>
			{{ $t('title') }}
			<NInput
				v-model:value="current.settings.downloadLabel"
				:placeholder="$t('title')"
			/>
		</div>

		<div
			v-if="current.settings.downloadData || current.reportType === 'download'"
			class="control control-label"
		>
			{{ $t('rows') }}
			<span>
				<strong>( {{ $t('zeroNoLimit') }} )</strong>
			</span>
			<NInputNumber
				v-model:value="current.settings.downloadRows"
				:step="1"
				:placeholder="$t('rows')"
			/>
		</div>

		<div v-if="current.settings.downloadData || current.reportType === 'download'">
			<div class="control control-label">
				{{ $t('color') }}
			</div>
			<NColorPicker
				v-model="current.settings.downloadColor"
				:modes="['hex']"
			/>
		</div>
		<div
			v-if="current.reportType === 'download'"
			class="control flex-grow-1"
		>
			<div class="control-label">{{ $t('size') }}</div>
			<NSelect
				v-model:value="current.settings.downloadSize"
				size="small"
				:options="[
					{ label: $t('large'), value: 'large' },
					{ label: $t('medium'), value: 'default' },
					{ label: $t('default'), value: 'small' }
				]"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'

const { current } = useReportStore()
</script>
