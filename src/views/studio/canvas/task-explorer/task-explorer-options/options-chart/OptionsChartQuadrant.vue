<template>
	<NCollapseItem
		name="quadrant"
		:title="$t('quadrant')"
	>
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="action" />
				{{ $t('quadrant') }}
			</div>
		</template>
		<div class="options-chart-quadrant control-secondary">
			<NCheckbox
				v-model:checked="useReportStore().current.settings.showQuadrant"
				:label="$t('showQuadrant')"
				class="w-full"
			/>
			<template v-if="useReportStore().current.settings.showQuadrant">
				<div class="control mt-4">
					<div class="control-label">{{ $t('xAxis') }}</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.quadrantX"
						:placeholder="$t('xAxis')"
					/>
				</div>
				<div class="control">
					<div class="control-label">{{ $t('yAxis') }}</div>
					<NInputNumber
						v-model:value="useReportStore().current.settings.quadrantY"
						:placeholder="$t('yAxis')"
					/>
				</div>
				<div class="control">
					<div class="control-label">
						{{ $t('quadrantContent') }}
					</div>
					<NInput
						v-model:value="useReportStore().current.settings.quadrantContent"
						type="textarea"
						:placeholder="$t('defineToEnable')"
					/>
				</div>
			</template>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import { useReportStore } from '@/stores'
import { NCheckbox, NInput, NInputNumber } from 'naive-ui'
</script>
