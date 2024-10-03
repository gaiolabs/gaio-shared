<template>
	<NCollapseItem
		name="general"
		:title="$t('general')"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="general" />
				{{ $t('general') }}
			</div>
		</template>
		<div class="options-chart-general control-secondary">
			<NCheckbox
				v-if="useReportStore().showOnlyIf(['funnel'])"
				v-model:checked="useReportStore().current.settings.transposed"
				:label="$t('transposed')"
				class="w-full"
			/>
			<NCheckbox
				v-if="useReportStore().showOnlyIf(['calendar'])"
				v-model:checked="useReportStore().current.settings.showFullYear"
				:label="$t('showFullYear')"
				class="w-full"
			/>
			<NCheckbox
				v-if="useReportStore().showOnlyIf(['treemap'])"
				v-model:checked="useReportStore().current.settings.enableTreemapZoom"
				:label="$t('enableZoom') + ' (Refresh to apply)'"
				class="w-full"
			/>
			<div
				v-if="useReportStore().showOnlyIf(['treemap'])"
				class="control"
			>
				<div class="control-label">{{ $t('leafDepth') }}</div>
				<NInputNumber
					v-model:value="useReportStore().current.settings.treemapLeafDepth"
					:min="0"
					:step="1"
					:placeholder="$t('leafDepth')"
					class="w-full"
				/>
			</div>
			<template v-if="useReportStore().showOnlyIf(['line', 'area'])">
				<NCheckbox
					v-model:checked="useReportStore().current.settings.showPoint"
					:label="$t('showPoint')"
					class="w-full"
				/>
				<NCheckbox
					v-model:checked="useReportStore().current.settings.lineSmooth"
					:label="$t('lineSmooth')"
					class="w-full"
				/>
			</template>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import { NCheckbox, NInputNumber } from 'naive-ui'
</script>
