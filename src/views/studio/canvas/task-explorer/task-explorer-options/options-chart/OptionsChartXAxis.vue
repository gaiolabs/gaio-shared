<template>
	<div class="options-chart-x-axis control-secondary">
		<div class="control-secondary">
			<n-checkbox
				v-model:checked="useReportStore().current.settings.showXAxis"
				:label="$t('enable')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
				v-model:checked="useReportStore().current.settings.xAxisAutoHideLabel"
				:label="$t('autoHideLabel')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
				v-model:checked="useReportStore().current.settings.xAxisAutoRotateLabel"
				:label="$t('autoRotateLabel')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet'])"
				v-model:checked="useReportStore().current.settings.showXGrid"
				:label="$t('showGrid')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet'])"
				v-model:checked="useReportStore().current.settings.showXLine"
				:label="$t('showBaseLine')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'forecast', 'dual'])"
				v-model:checked="useReportStore().current.settings.showXTitle"
				:label="$t('showTitle')"
				class="w-full"
			/>
			<div class="control">
				<div class="control-label">
					{{ $t('tickCount') }}
				</div>
				<n-input-number
					v-model:value="useReportStore().current.settings.xAxisTickCount"
					:step="2"
					:min="0"
					class="w-full"
				/>
			</div>
			<div v-if="!useReportStore().showOnlyIf(['bullet', 'forecast'])">
				<n-checkbox
					v-if="useReportStore().showOnlyIf(['combo']) && !useReportStore().isGrouped"
					v-model:checked="useReportStore().current.settings.comboSyncAxis"
					:label="$t('syncComboAxis')"
					class="w-full"
				/>

				<n-checkbox
					v-if="useReportStore().showOnlyIf(['combo']) || !useReportStore().showOnlyIf(['combo', 'dual'])"
					v-model:checked="useReportStore().current.settings.xAxisChangeScale"
					:label="$t('changeScale')"
					class="w-full"
				/>
				<div
					v-if="
						(useReportStore().showOnlyIf(['combo']) &&
							useReportStore().current.settings.comboSyncAxis &&
							useReportStore().current.settings.xAxisChangeScale) ||
						(!useReportStore().showOnlyIf(['combo']) && useReportStore().current.settings.xAxisChangeScale)
					"
					class="control"
				>
					<div class="control">
						<n-input-number
							v-model:value="useReportStore().current.settings.xAxisMaxScale"
							class="w-full"
						>
							<template #prefix>
								<span style="margin: 3px">{{ $t('max') }}</span>
							</template>
						</n-input-number>
					</div>
					<div class="control">
						<n-input-number
							v-model:value="useReportStore().current.settings.xAxisMinScale"
							class="w-full"
						>
							<template #prefix>
								<span style="margin: 3px">{{ $t('min') }}</span>
							</template>
						</n-input-number>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
