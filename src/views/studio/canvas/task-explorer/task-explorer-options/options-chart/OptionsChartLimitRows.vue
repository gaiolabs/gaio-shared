<template>
	<NCollapseItem name="limitRows">
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="limitRows" />
				{{ $t('limitRows') }}
			</div>
		</template>
		<div class="options-limit-rows control-secondary">
			<NInputNumber
				v-model:value="useReportStore().current.settings.limitRows"
				:min="0"
				:step="1"
				:placeholder="$t('rows')"
			/>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
