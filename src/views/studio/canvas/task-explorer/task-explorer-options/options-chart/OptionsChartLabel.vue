<template>
	<div class="options-chart-label control-secondary">
		<div
			v-if="useReportStore().showOnlyIf(['liquid'])"
			class="control"
		>
			<div class="control-label">{{ $t('fontSize') }}</div>
			<n-input-number
				v-model:value="useReportStore().current.settings.labelFontSize"
				:min="11"
				:max="60"
				:step="1"
				:placeholder="$t('fontSize')"
			/>
		</div>
		<div v-else>
			<n-checkbox
				v-model:checked="useReportStore().current.settings.showLabel"
				:label="$t('enable')"
				class="w-full"
			/>
			<n-checkbox
				v-if="useReportStore().showOnlyIf(['combo', 'dual'])"
				v-model:checked="useReportStore().current.settings.showLabelDualExtra"
				:label="$t('showLabelDualExtra')"
				class="w-full"
			/>
			<div v-if="useReportStore().current.settings.showLabel && !useReportStore().showOnlyIf(['liquid'])">
				<n-checkbox
					v-if="useReportStore().showOnlyIf(['pie', 'treemap', 'funnel'])"
					v-model:checked="useReportStore().current.settings.showLabelDimension"
					class="w-full"
					:label="$t('dimension')"
				/>
				<n-checkbox
					v-if="useReportStore().showOnlyIf(['pie', 'treemap', 'funnel'])"
					v-model:checked="useReportStore().current.settings.showLabelMeasure"
					class="w-full"
					:label="$t('measure')"
				/>
				<n-checkbox
					v-if="useReportStore().showOnlyIf(['column', 'pie'])"
					v-model:checked="useReportStore().current.settings.showLabelPercent"
					class="w-full"
					:label="$t('percent')"
				/>
				<n-checkbox
					v-if="!useReportStore().showOnlyIf(['histogram'])"
					v-model:checked="useReportStore().current.settings.compactNumberLabel"
					class="w-full"
					:label="$t('compactNumbersOfLabel')"
				/>
				<div
					v-if="useReportStore().hideOnlyIf(['gauge', 'bullet', 'funnel', 'calendar', 'line', 'dual'])"
					class="control"
				>
					<n-checkbox
						v-if="useReportStore().hideOnlyIf(['pie'])"
						v-model:checked="useReportStore().current.settings.showTotal"
						class="w-full"
						:label="$t('showTotal')"
					/>

					<div
						v-if="!useReportStore().current.settings.showTotal"
						class="mt-1"
					>
						<div class="control-label">
							{{ $t('position') }}
						</div>
						<n-select
							v-model:value="useReportStore().current.settings.showLabelType"
							class="w-full"
							:options="[
								{
									value: 'top',
									label: $t('top')
								},
								{
									value: 'middle',
									label: $t('middle')
								},
								{
									value: 'bottom',
									label: $t('bottom')
								}
							]"
						/>
					</div>
				</div>
				<!--FONTSIZE -->
				<div
					v-if="!useReportStore().showOnlyIf(['dual'])"
					class="control"
				>
					<div class="control-label">{{ $t('fontSize') }}</div>
					<n-input-group>
						<n-input-number
							v-model:value="useReportStore().current.settings.labelFontSize"
							:min="9"
							:max="60"
							:step="1"
							:placeholder="$t('fontSize')"
							class="w-full"
						/>
					</n-input-group>
					<div class="control">
						<div class="control-label">{{ $t('color') }}</div>
						<n-color-picker v-model:value="useReportStore().current.settings.labelFontColor" />
					</div>
				</div>
				<div class="control">
					<n-checkbox
						v-if="useReportStore().showOnlyIf(['gauge'])"
						v-model:checked="useReportStore().current.settings.showLabelPercent"
						class="w-full"
						:label="$t('statisticPercent')"
					/>
				</div>
				<div
					v-if="useReportStore().showOnlyIf(['gauge'])"
					class="control"
				>
					<div class="control-label">{{ $t('statistics') }}/{{ $t('fontSize') }}</div>
					<n-input-number
						v-model:value="useReportStore().current.settings.staticFontSize"
						:min="9"
						:max="90"
						:step="1"
						:placeholder="$t('fontSize')"
					/>
				</div>

				<!--                <n-input-number-->
				<!--                    v-model:value="useReportStore().current.settings.labelRotate"-->
				<!--                    :step="1"-->
				<!--                    :placeholder="$t('rotate')"-->
				<!--                    class="w-full"-->
				<!--                />-->
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
