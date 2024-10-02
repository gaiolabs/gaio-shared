<template>
	<NCollapseItem
		name="label"
		:title="$t('label')"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="label" />
				{{ $t('label') }}
			</div>
		</template>
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
				<div v-if="useReportStore().current.settings.showLabel && useReportStore().hideOnlyIf(['liquid'])">
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
						v-if="useReportStore().showOnlyIf(['column', 'pie', 'donut', 'gauge'])"
						v-model:checked="useReportStore().current.settings.showLabelPercent"
						class="w-full"
						:label="$t('percent')"
					/>
					<NCheckbox
						v-if="useReportStore().hideOnlyIf(['histogram', 'sunburst', 'calendar'])"
						v-model:checked="useReportStore().current.settings.compactNumberLabel"
						class="w-full"
						:label="$t('compactNumbersOfLabel')"
					/>
					<NCheckbox
						v-if="useReportStore().showOnlyIf(['gauge'])"
						v-model:checked="useReportStore().current.settings.showPoint"
						class="w-full"
						:label="$t('showPointer')"
					/>
					<div
						v-if="useReportStore().hideOnlyIf(['gauge', 'bullet', 'funnel', 'calendar', 'line', 'dual'])"
						class="control"
					>
						<NCheckbox
							v-if="useReportStore().hideOnlyIf(['pie', 'donut', 'sunburst'])"
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
								v-if="useReportStore().showOnlyIf(['pie', 'sunburst'])"
								v-model:value="useReportStore().current.settings.showLabelType"
								class="w-full"
								:options="[
									{
										value: 'outside',
										label: $t('outside'),
									},
									{
										value: 'inside',
										label: $t('inside'),
									},
									{
										value: 'center',
										label: $t('center'),
									},
								]"
							/>
							<NSelect
								v-if="!useReportStore().showOnlyIf(['pie', 'sunburst'])"
								v-model:value="useReportStore().current.settings.showLabelType"
								class="w-full"
								:options="[
									{
										value: 'top',
										label: $t('top'),
									},
									{
										value: 'right',
										label: $t('right'),
									},
									{
										value: 'bottom',
										label: $t('bottom'),
									},
									{
										value: 'left',
										label: $t('left'),
									},
									{
										value: 'inside',
										label: $t('inside'),
									},
									{
										value: 'insideTop',
										label: $t('insideTop'),
									},
									{
										value: 'insideRight',
										label: $t('insideRight'),
									},
									{
										value: 'insideBottom',
										label: $t('insideBottom'),
									},
									{
										value: 'insideLeft',
										label: $t('insideLeft'),
									},
								]"
							/>
						</div>
					</div>
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
				</div>
			</div>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import { useReportStore } from '@/stores'
import { NCheckbox, NInputNumber } from 'naive-ui'
</script>
