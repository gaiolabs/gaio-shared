<template>
	<NCollapseItem
		:title="$t('yAxis')"
		name="yAxis"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="yAxis" />
				{{ $t('yAxis') }}
			</div>
		</template>
		<div class="options-chart-y-axis control-secondary">
			<div class="control-secondary">
				<NCheckbox
					v-model:checked="useReportStore().current.settings.showYAxis"
					:label="$t('enable')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
					v-model:checked="useReportStore().current.settings.yAxisAutoHideLabel"
					:label="$t('autoHideLabel')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'dual'])"
					v-model:checked="useReportStore().current.settings.yAxisAutoRotateLabel"
					:label="$t('autoRotateLabel')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet'])"
					v-model:checked="useReportStore().current.settings.showYGrid"
					:label="$t('showGrid')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet'])"
					v-model:checked="useReportStore().current.settings.showYLine"
					:label="$t('showBaseLine')"
					class="w-full"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['bullet', 'forecast', 'dual'])"
					v-model:checked="useReportStore().current.settings.showYTitle"
					:label="$t('showTitle')"
					class="w-full"
				/>
				<div class="control">
					<div class="control-label">
						{{ $t('tickCount') }}
					</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.yAxisTickCount"
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
							<NInputNumber
								v-model:value="useReportStore().current.settings.yAxisMaxScale"
								class="w-full"
							>
								<template #prefix>
									<span style="margin: 3px">{{ $t('max') }}</span>
								</template>
							</NInputNumber>
						</div>
						<div class="control">
							<NInputNumber
								v-model:value="useReportStore().current.settings.yAxisMinScale"
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
