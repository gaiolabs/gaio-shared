<template>
	<div
		v-if="localFlow && localFlow.cronBase"
		class="flow-control-schedule"
	>
		<CronBase
			:cron-base="localFlow.cronBase"
			@change="updateFlow"
		/>
	</div>
</template>

<script setup lang="ts">
import CronBase from '@/components/cron-base/CronBase.vue'
import type { CronBaseType, FlowType } from '@gaio/shared/types'

const { localFlow = null } = defineProps<{ localFlow: FlowType }>()

const updateFlow = (cronBase: CronBaseType) => {
	localFlow.cronBase = cronBase
	localFlow.cron = cronBase.current
	localFlow.cronStatus = cronBase.status
}
</script>
