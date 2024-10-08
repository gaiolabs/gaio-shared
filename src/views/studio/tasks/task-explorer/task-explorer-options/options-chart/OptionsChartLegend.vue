<template>
	<NCollapseItem name="legend">
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="legend" />
				{{ $t('legend') }}
			</div>
		</template>
		<div class="options-chart-legend control-secondary">
			<NCheckbox
				v-model:checked="useReportStore().current.settings.showLegend"
				:label="$t('enable')"
				class="w-full"
			/>
			<div v-if="useReportStore().current.settings.showLegend && useReportStore().hideOnlyIf(['liquid'])">
				<div v-if="useReportStore().hideOnlyIf(['gauge', 'calendar', 'heatmap'])">
					<div class="control">
						<div class="control-label">
							{{ $t('position') }}
						</div>
						<NSelect
							v-model:value="useReportStore().current.settings.legendPosition"
							class="w-full"
							:options="[
								{ value: 'top', label: $t('top') },
								{ value: 'top-left', label: $t('top') + ' ' + $t('left') },
								{ value: 'top-right', label: $t('top') + ' ' + $t('right') },
								{ value: 'right', label: $t('right') },
								{ value: 'right-top', label: $t('right') + ' ' + $t('top') },
								{ value: 'right-bottom', label: $t('right') + ' ' + $t('bottom') },
								{ value: 'left', label: $t('left') },
								{ value: 'left-top', label: $t('left') + ' ' + $t('top') },
								{ value: 'left-bottom', label: $t('left') + ' ' + $t('bottom') },
								{ value: 'bottom', label: $t('bottom') },
								{ value: 'bottom-left', label: $t('bottom') + ' ' + $t('left') },
								{ value: 'bottom-right', label: $t('bottom') + ' ' + $t('right') },
							]"
						/>
					</div>

					<div
						v-if="useReportStore().hideOnlyIf(['bullet', 'dual'])"
						class="control"
					>
						<div class="control-label">{{ $t('color') }}</div>
						<NColorPicker
							v-model:value="useReportStore().current.settings.legendFontColor"
							:modes="['hex']"
						/>

						<!-- <div class="control-label">{{ $t('fontSize') }}</div>

						<NInputNumber
							v-model:value="useReportStore().current.settings.legendFontSize"
							:min="9"
							:max="60"
							:step="1"
							:placeholder="$t('fontSize')"
						/> -->
					</div>
				</div>
			</div>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
