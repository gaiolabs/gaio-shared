<template>
    <div class="home-insights g-bg-1 my-3 rounded shadow">
        <div class="flex items-center justify-between gap-4 px-4 py-2">
            <div class="flex flex-row items-center gap-1 text-lg font-bold" @click="collapse = !collapse">
                <g-icon name="magic" />
                10 {{ $t('new') }} {{ $t('insights') }}
            </div>

            <n-button tertiary>
                {{ $t('seeAll') }}
            </n-button>
        </div>
        <div v-if="collapse" class="animate-fade-in mt-3 w-full px-4 pb-4">
            <n-space>
                <insight-card v-for="(ins, index) of insightsList" :key="index" :insight="ins" />
            </n-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InsightCardType } from '@gaio/shared/types'
import { ref } from 'vue'

import InsightCard from '@/views/insights/InsightCard.vue'

const collapse = ref(true)
const insightsList = ref<InsightCardType[]>([
    {
        reference: 'up',
        inverted: false,
        percentage: 10,
        measure: 'Sales',
        dimension: 'State',
        dimensionValue: 'New York',
        currenMeasureValue: 2000,
        previousMeasureValue: 12345,
        tableName: 'Source',
        created: '23/09/2022 00:23'
    },
    {
        reference: 'down',
        inverted: false,
        percentage: 10,
        measure: 'Sales',
        dimension: 'State',
        dimensionValue: 'New York',
        currenMeasureValue: 2000,
        previousMeasureValue: 12345,
        tableName: 'Source',
        created: '23/09/2022 00:23'
    },
    {
        reference: 'down',
        inverted: true,
        percentage: 10,
        measure: 'Sales',
        dimension: 'State',
        dimensionValue: 'New York',
        currenMeasureValue: 2000,
        previousMeasureValue: 12345,
        tableName: 'Source',
        created: '23/09/2022 00:23'
    },
    {
        reference: 'up',
        inverted: true,
        percentage: 10,
        measure: 'Sales',
        dimension: 'State',
        dimensionValue: 'New York',
        currenMeasureValue: 2000,
        previousMeasureValue: 12345,
        tableName: 'Source',
        created: '23/09/2022 00:23'
    }
])
</script>
