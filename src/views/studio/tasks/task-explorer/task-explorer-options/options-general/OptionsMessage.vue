<template>
	<NCollapseItem name="message">
		<template #header>
			<div class="flex items-center gap-1">
				<GIcon name="info" />
				{{ $t('message') }}
			</div>
		</template>
		<div class="options-message control-secondary">
			<div class="control">
				<div class="control-label">
					{{ $t('messageNoData') }}
				</div>
				<NInput
					v-model:value="useReportStore().current.settings.noDataSentence"
					type="textarea"
					:placeholder="$t('defineToEnable')"
				/>
			</div>
		</div>
	</NCollapseItem>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
