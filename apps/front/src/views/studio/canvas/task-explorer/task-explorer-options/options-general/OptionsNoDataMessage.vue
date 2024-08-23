<template>
    <div class="options-no-data-message">
        <div class="mb-1 rounded bg-paper-200 p-1 dark:bg-carbon-200">
            {{ $t('noDataSentence') }}
        </div>
        <n-input
            v-model:value="current.settings.noDataSentence"
            type="textarea"
            :placeholder="$t('defineToEnable')"
        />
    </div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'

const { current } = useReportStore()
</script>
