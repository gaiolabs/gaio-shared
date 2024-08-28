<template>
    <div class="task-builder-options-sort mx-1 mt-2 rounded-[8px] bg-elevation-1 p-2">
        <n-radio-group v-model:value="localField.field.order" size="small" type="button">
            <n-radio-button value="asc" :label="$t('asc')" />
            <n-radio-button value="desc" :label="$t('desc')" />
        </n-radio-group>
    </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FieldType } from '@gaio/shared/types'

defineProps({
    localField: {
        type: Object as PropType<{ type: string; field: Partial<FieldType> }>,
        required: true
    }
})
</script>
