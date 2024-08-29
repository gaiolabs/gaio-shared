<template>
	<div class="options-chart-y-axis control-secondary">
		<div class="control-secondary">
			<n-checkbox
				v-model:checked="useReportStore().current.settings.showYAxis"
				:label="$t('enable')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
				v-model:checked="useReportStore().current.settings.yAxisAutoHideLabel"
				:label="$t('autoHideLabel')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
				v-model:checked="useReportStore().current.settings.yAxisAutoRotateLabel"
				:label="$t('autoRotateLabel')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet'])"
				v-model:checked="useReportStore().current.settings.showYGrid"
				:label="$t('showGrid')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet'])"
				v-model:checked="useReportStore().current.settings.showYLine"
				:label="$t('showBaseLine')"
				class="w-full"
			/>
			<n-checkbox
				v-if="!useReportStore().showOnlyIf(['bullet', 'forecast', 'dual'])"
				v-model:checked="useReportStore().current.settings.showYTitle"
				:label="$t('showTitle')"
				class="w-full"
			/>
			<div class="control">
				<div class="control-label">
					{{ $t('tickCount') }}
				</div>
				<n-input-number
					v-model:value="useReportStore().current.settings.yAxisTickCount"
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
					v-model:checked="useReportStore().current.settings.yAxisChangeScale"
					:label="$t('changeScale')"
					class="w-full"
				/>
				<div
					v-if="
						(useReportStore().showOnlyIf(['combo']) &&
							useReportStore().current.settings.comboSyncAxis &&
							useReportStore().current.settings.yAxisChangeScale) ||
						(!useReportStore().showOnlyIf(['combo']) && useReportStore().current.settings.yAxisChangeScale)
					"
					class="control"
				>
					<div class="control">
						<n-input-number
							v-model:value="useReportStore().current.settings.yAxisMaxScale"
							class="w-full"
						>
							<template #prefix>
								<span style="margin: 3px">{{ $t('max') }}</span>
							</template>
						</n-input-number>
					</div>
					<div class="control">
						<n-input-number
							v-model:value="useReportStore().current.settings.yAxisMinScale"
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
