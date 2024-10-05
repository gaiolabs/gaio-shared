<template>
	<NCollapseItem name="rowsPerPage">
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="rowsPerPage" />
				{{ $t('rowsDisplayed') }}
			</div>
		</template>
		<div class="options-rows-per-page control-secondary">
			<NInputNumber
				v-model:value="useReportStore().current.settings.pageSize"
				:min="0"
				:step="1"
				:placeholder="$t('rows')"
			>
				<template #prefix>
					<g-icon name="table" />
				</template>
			</NInputNumber>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
