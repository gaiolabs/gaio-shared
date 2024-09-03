<template>
	<div v-if="localFlow && localFlow.cronBase" class="flow-control-schedule px-4">
		<cron-base :cron-base="localFlow.cronBase" @change="updateFlow" />
	</div>
</template>

<script setup lang="ts">
import type { FlowType } from '@gaio/shared/types'

const updateFlow = (cronBase) => {
	console.log('updateFlow', cronBase)
	// localFlow.cronBase = $event
}

withDefaults(defineProps<{ localFlow: FlowType }>(), {
	localFlow: null
})
</script>
