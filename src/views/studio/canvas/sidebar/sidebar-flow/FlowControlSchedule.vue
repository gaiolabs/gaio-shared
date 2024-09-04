<template>
	<div
		v-if="localFlow && localFlow.cronBase"
		class="flow-control-schedule px-4"
	>
		<cron-base
			:cron-base="localFlow.cronBase"
			@change="updateFlow"
		/>
	</div>
</template>

<script setup lang="ts">
import type { CronBaseType, FlowType } from '@gaio/shared/types'

const props = withDefaults(defineProps<{ localFlow: FlowType }>(), {
	localFlow: null
})

const updateFlow = (cronBase: CronBaseType) => {
	props.localFlow.cronBase = cronBase
	props.localFlow.cron = cronBase.current
	props.localFlow.cronStatus = cronBase.status

	console.log('cronbase', cronBase)
}
</script>
