<template>
    <div class="g-view-table">
        <n-tooltip
            :persistent="false"
            :show-after="1500"
            :content="$t('viewTable')"
        >
            <template #trigger>
                <n-button
                    text
                    :underline="false"
                    @click="useBus.emit('openTable', tableName)"
                >
                    <g-icon name="eye" />
                </n-button>
            </template>
            {{ $t('viewTable') }}
        </n-tooltip>
    </div>
</template>
<script setup lang="ts">
import useBus from '@/composables/useBus'

defineProps<{ tableName: string }>()
</script>
