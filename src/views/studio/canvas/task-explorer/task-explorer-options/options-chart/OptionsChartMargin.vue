<template>
    <div class="options-chart-margin control-secondary">
        <div class="space-between flex gap-2">
            <div>
                <div class="control-label">{{ $t('top') }}</div>
                <n-input-number v-model:value="useReportStore().current.settings.appendPaddingTop" />
            </div>
            <div>
                <div class="control-label">{{ $t('right') }}</div>
                <n-input-number v-model:value="useReportStore().current.settings.appendPaddingRight" />
            </div>
        </div>
        <div class="space-between flex gap-2">
            <div>
                <div class="control-label">{{ $t('left') }}</div>
                <n-input-number v-model:value="useReportStore().current.settings.appendPaddingLeft" />
            </div>
            <div>
                <div class="control-label">{{ $t('bottom') }}</div>
                <n-input-number v-model:value="useReportStore().current.settings.appendPaddingBottom" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>
