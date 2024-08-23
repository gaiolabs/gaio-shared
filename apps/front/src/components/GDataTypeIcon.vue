<template>
    <g-icon
        :name="name"
        :style="{ color }"
        class="g-data-type-icon"
    />
</template>
<script setup lang="ts">
import { computed } from 'vue'

import useDataType from '@/composables/useDataType'

const { dataTypeIcon, dataTypeName } = useDataType()

const props = defineProps<{
    dataType: string
}>()

const color = computed(() => {
    switch (dataTypeName(props.dataType)) {
        case 'text':
            return '#00718c'
        case 'decimal':
            return '#cc000c'
        case 'integer':
            return '#cc000c'
        case 'date':
            return '#995300'
        case 'datetime':
            return '#995300'
        default:
            return '#1f1f1f'
    }
})

const name = computed(() => {
    return props.dataType ? dataTypeIcon(props.dataType) : ('' as string)
})
</script>
