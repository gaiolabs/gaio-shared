<template>
	<div class="relative flex items-center justify-center rounded-lg overflow-hidden">
		<span
			v-if="name"
			:data-icon="name"
			:style="{ color: fontColor, fontSize }"
			class="z-10"
		>
			<i :class="iconName" />
		</span>
		<div
			class="absolute inset-0 opacity-10 z-0 m-[px]"
			:style="{ backgroundColor: color }"
		></div>
		<div
			class="absolute inset-0 border rounded-lg opacity-40 z-0"
			:style="{ borderColor: color }"
		></div>
		<div class="absolute inset-0 bg-white dark:bg-transparent z-[-1]"></div>
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
