<template>
	<div class="relative flex items-center justify-center rounded-lg overflow-hidden g-base">
		<span
			v-if="name"
			:data-icon="name"
			:style="{ color: fontColor, fontSize }"
			class="z-10"
		>
			<i :class="iconName" />
		</span>
		<div
			class="absolute inset-0 opacity-[7.5%] dark:opacity-[3%] z-0 m-[px]"
			:style="{ backgroundColor: color }"
		></div>
		<!-- <div class="absolute inset-0 bg-red-500 z-[-1]"></div> -->
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	size: {
		type: [String, Number],
		default: 'inherit',
	},
	color: {
		type: String,
		default: undefined,
	},
})

const fontSize = computed(() => (props.size && props.size !== 'inherit' ? `${props.size}px` : null))
const fontColor = computed(() => props.color || null)
const iconName = computed(() => (props.name.startsWith('icon-') ? props.name : `icon-square-dashed-bottom`))
</script>

<style scoped>
i {
	vertical-align: bottom;
}
</style>
