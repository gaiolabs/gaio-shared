<template>
	<div class="options-chart-label control-secondary">
		<div
			v-if="useReportStore().showOnlyIf(['liquid'])"
			class="control"
		>
			<div class="control-label">{{ $t('fontSize') }}</div>
			<NInputNumber
				v-model:value="useReportStore().current.settings.labelFontSize"
				:min="11"
				:max="60"
				:step="1"
				:placeholder="$t('fontSize')"
			/>
		</div>
		<div v-else>
			<NCheckbox
				v-model:checked="useReportStore().current.settings.showLabel"
				:label="$t('enable')"
				class="w-full"
			/>
			<NCheckbox
				v-if="useReportStore().showOnlyIf(['combo', 'dual'])"
				v-model:checked="useReportStore().current.settings.showLabelDualExtra"
				:label="$t('showLabelDualExtra')"
				class="w-full"
			/>
			<div v-if="useReportStore().current.settings.showLabel && !useReportStore().showOnlyIf(['liquid'])">
				<NCheckbox
					v-if="useReportStore().showOnlyIf(['pie', 'donut', 'treemap', 'funnel'])"
					v-model:checked="useReportStore().current.settings.showLabelDimension"
					class="w-full"
					:label="$t('dimension')"
				/>
				<NCheckbox
					v-if="useReportStore().showOnlyIf(['pie', 'treemap', 'funnel', 'donut'])"
					v-model:checked="useReportStore().current.settings.showLabelMeasure"
					class="w-full"
					:label="$t('measure')"
				/>
				<NCheckbox
					v-if="useReportStore().showOnlyIf(['column', 'pie', 'donut'])"
					v-model:checked="useReportStore().current.settings.showLabelPercent"
					class="w-full"
					:label="$t('percent')"
				/>
				<NCheckbox
					v-if="!useReportStore().showOnlyIf(['histogram'])"
					v-model:checked="useReportStore().current.settings.compactNumberLabel"
					class="w-full"
					:label="$t('compactNumbersOfLabel')"
				/>
				<div
					v-if="useReportStore().hideOnlyIf(['gauge', 'bullet', 'funnel', 'calendar', 'line', 'dual'])"
					class="control"
				>
					<NCheckbox
						v-if="useReportStore().hideOnlyIf(['pie', 'donut'])"
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
						<NSelect
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
					<NInputGroup>
						<NInputNumber
							v-model:value="useReportStore().current.settings.labelFontSize"
							:min="9"
							:max="60"
							:step="1"
							:placeholder="$t('fontSize')"
							class="w-full"
						/>
					</NInputGroup>
					<div class="control">
						<div class="control-label">{{ $t('color') }}</div>
						<NColorPicker v-model:value="useReportStore().current.settings.labelFontColor" />
					</div>
				</div>
				<div class="control">
					<NCheckbox
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
					<NInputNumber
						v-model:value="useReportStore().current.settings.staticFontSize"
						:min="9"
						:max="90"
						:step="1"
						:placeholder="$t('fontSize')"
					/>
				</div>

				<!--                <NInputNumber-->
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
