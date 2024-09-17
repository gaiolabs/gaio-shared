<template>
	<NCollapseItem
		:title="$t('xAxis')"
		name="xAxis"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="xAxis" />
				{{ $t('xAxis') }}
			</div>
		</template>
		<div class="options-chart-x-axis control-secondary">
			<div class="control-secondary">
				<NCheckbox
					v-model:checked="useReportStore().current.settings.showXAxis"
					:label="$t('enable')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
					v-model:checked="useReportStore().current.settings.xAxisAutoHideLabel"
					:label="$t('autoHideLabel')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
					v-model:checked="useReportStore().current.settings.xAxisAutoRotateLabel"
					:label="$t('autoRotateLabel')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet'])"
					v-model:checked="useReportStore().current.settings.showXGrid"
					:label="$t('showGrid')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet'])"
					v-model:checked="useReportStore().current.settings.showXLine"
					:label="$t('showBaseLine')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'forecast', 'dual'])"
					v-model:checked="useReportStore().current.settings.showXTitle"
					:label="$t('showTitle')"
					class="w-full"
				/>
				<div class="control">
					<div class="control-label">
						{{ $t('tickCount') }}
					</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.xAxisTickCount"
						:step="2"
						:min="0"
						class="w-full"
					/>
				</div>
				<div v-if="!useReportStore().showOnlyIf(['bullet', 'forecast'])">
					<NCheckbox
						v-if="useReportStore().showOnlyIf(['combo']) && !useReportStore().isGrouped"
						v-model:checked="useReportStore().current.settings.comboSyncAxis"
						:label="$t('syncComboAxis')"
						class="w-full"
					/>

					<NCheckbox
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
							<NInputNumber
								v-model:value="useReportStore().current.settings.xAxisMaxScale"
								class="w-full"
							>
								<template #prefix>
									<span style="margin: 3px">{{ $t('max') }}</span>
								</template>
							</NInputNumber>
						</div>
						<div class="control">
							<NInputNumber
								v-model:value="useReportStore().current.settings.xAxisMinScale"
								class="w-full"
							>
								<template #prefix>
									<span style="margin: 3px">{{ $t('min') }}</span>
								</template>
							</NInputNumber>
						</div>
					</div>
				</div>
			</div>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
