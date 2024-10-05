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
					<NInputNumber
						v-model:value="useReportStore().current.settings.appendPaddingTop"
						:min="0"
						:step="1"
						:max="100"
					/>
				</div>
				<div>
					<div class="control-label">{{ $t('right') }}</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.appendPaddingRight"
						:step="1"
						:min="0"
						:max="100"
					/>
				</div>
			</div>
			<div class="space-between flex gap-2">
				<div>
					<div class="control-label">{{ $t('left') }}</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.appendPaddingLeft"
						:step="1"
						:min="0"
						:max="100"
					/>
				</div>
				<div>
					<div class="control-label">{{ $t('bottom') }}</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.appendPaddingBottom"
						:step="1"
						:min="0"
						:max="100"
					/>
				</div>
			</div>
		</div>
	</NCollapseItem>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
