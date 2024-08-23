<template>
    <div class="options-chart-general control-secondary">
        <n-checkbox
            v-model:checked="useReportStore().current.settings.showHeader"
            :label="$t('showCardHeader')"
            class="!w-full"
        />
        <n-checkbox
            v-if="useReportStore().current.settings.showHeader"
            v-model:checked="useReportStore().current.settings.headerBackgroundDark"
            :label="$t('headerBackgroundDark')"
            class="w-full"
        />
        <n-checkbox
            v-model:checked="useReportStore().current.settings.showTable"
            :label="$t('showTable')"
            class="w-full"
        />

        <template v-if="useReportStore().showOnlyIf(['line', 'area'])">
            <n-divider class="!my-3" />
            <n-checkbox
                v-model:checked="useReportStore().current.settings.showPoint"
                :label="$t('showPoint')"
                class="w-full"
            />
            <n-checkbox
                v-model:checked="useReportStore().current.settings.lineSmooth"
                :label="$t('lineSmooth')"
                class="w-full"
            />
        </template>
    </div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
</script>

<style lang="scss">
.options-chart-general {
    .n-collapse-item {
        margin-left: 0 !important;
    }

    .n-collapse-item__header-main {
        display: flex;
        justify-content: flex-start;
    }
}
</style>
