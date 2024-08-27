<template>
    <div v-if="localFlow && localFlow.cronBase" class="flow-control-schedule px-4">
        <cron-base :cron-base="localFlow.cronBase" @change="localFlow.cronBase = $event" />
    </div>
</template>

<script setup lang="ts">
import type { FlowType } from '@gaio/shared/types'

withDefaults(defineProps<{ localFlow: FlowType }>(), {
    localFlow: null
})
</script>
