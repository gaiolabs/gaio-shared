<template>
	<NCollapseItem
		name="guideline"
		:title="$t('guideline')"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="guideline" />
				{{ $t('guideline') }}
			</div>
		</template>
		<div class="options-chart-guideline control-secondary">
			<div class="control-label">
				{{ $t('type') }}
			</div>
			<NSelect
				v-model:value="useReportStore().current.settings.guideScatterType"
				class="w-100"
				:options="options"
			/>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import { useReportStore } from '@/stores'
import { NSelect } from 'naive-ui'

const options = [
	{
		label: 'NONE',
		value: 'none'
	},
	{
		label: 'quad',
		value: 'quad'
	},
	{
		label: 'linear',
		value: 'linear'
	},
	{
		label: 'exp',
		value: 'exp'
	},
	{
		label: 'loess',
		value: 'loess'
	},
	{
		label: 'log',
		value: 'log'
	},
	{
		label: 'poly',
		value: 'poly'
	},
	{
		label: 'pow',
		value: 'pow'
	},
	{
		label: 'quad',
		value: 'quad'
	}
]
</script>
