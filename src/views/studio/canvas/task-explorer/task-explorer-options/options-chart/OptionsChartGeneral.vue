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
import { NCheckbox } from 'naive-ui'
</script>
