<template>
	<NCollapseItem
		:title="$t('margin')"
		name="margin"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="margin" />
				{{ $t('margin') }}
			</div>
		</template>
		<div class="options-chart-margin control-secondary">
			<div class="space-between flex gap-2">
				<div>
					<div class="control-label">{{ $t('top') }}</div>
					<NInputNumber v-model:value="useReportStore().current.settings.appendPaddingTop" />
				</div>
				<div>
					<div class="control-label">{{ $t('right') }}</div>
					<NInputNumber v-model:value="useReportStore().current.settings.appendPaddingRight" />
				</div>
			</div>
			<div class="space-between flex gap-2">
				<div>
					<div class="control-label">{{ $t('left') }}</div>
					<NInputNumber v-model:value="useReportStore().current.settings.appendPaddingLeft" />
				</div>
				<div>
					<div class="control-label">{{ $t('bottom') }}</div>
					<NInputNumber v-model:value="useReportStore().current.settings.appendPaddingBottom" />
				</div>
			</div>
		</div>
	</NCollapseItem>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
