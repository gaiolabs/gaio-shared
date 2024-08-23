<template>
    <div>
        <slot />
        <div class="h-[60px]"></div>
    </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
const windowSize = useWindowSize()

defineProps({
    wFull: {
        type: Boolean,
        default: false
    }
})

const scrollHeight = ref({ maxHeight: '200px' })

watchEffect(() => {
    scrollHeight.value = {
        maxHeight: windowSize.height.value + 'px'
    }
})
</script>
