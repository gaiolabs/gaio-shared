<template>
    <span
        v-if="name"
        :data-icon="name"
        :style="{ color: fontColor, fontSize }"
    >
        <i :class="iconName" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: [String, Number],
        default: 'inherit',
        required: false
    },
    color: {
        type: String,
        default: undefined,
        required: false
    }
})

const fontSize = computed(() => (props.size && props.size !== 'inherit' ? `${props.size}px` : null))
const fontColor = computed(() => (props.color ? props.color : null))
const iconName = computed(() => (props.name.startsWith('icon-') ? props.name : `icon-square-dashed-bottom`))
</script>

<style scoped>
i {
    vertical-align: bottom;
}
</style>
