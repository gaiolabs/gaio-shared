<template>
	<div class="options-message control-secondary">
		<div class="control">
			<div class="control-label">
				{{ $t('messageHelper') }}
			</div>
			<NInput
				v-model:value="current.settings.description"
				type="textarea"
				:placeholder="$t('defineToEnable')"
			/>
		</div>
		<div class="control">
			<div class="control-label">
				{{ $t('messageNoData') }}
			</div>
			<NInput
				v-model:value="current.settings.noDataSentence"
				type="textarea"
				:placeholder="$t('defineToEnable')"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'

const { current } = useReportStore()
</script>
