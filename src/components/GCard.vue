<template>
    <div
        class="p-3"
        :class="{ 'core-shadow': shadow, 'core-gradient': gradient, 'border dark:border-gray-800': border }"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{ shadow?: boolean; gradient?: boolean; border?: boolean }>()
</script>
