<template>
	<img
		v-if="localTask && localTask.type && generateIcon"
		class="me-2 size-[16px]"
		:src="generateIcon"
		:alt="localTask.type"
	/>
</template>
<script setup lang="ts">
import { generateBase } from '@/views/studio/board/BoardIcons'
import type { TaskType } from '@gaio/shared/types'
import { computed } from 'vue'

const { localTask = null } = defineProps<{ localTask: TaskType }>()

const generateIcon = computed(() => {
	const image = `../assets${generateBase(localTask).image}`
	if (!image) {
		return ''
	}
	return new URL(image, import.meta.url).href
})
</script>
