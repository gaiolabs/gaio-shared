<template>
	<button
		:class="{
			primary: type === 'primary',
			secondary: type === 'secondary',
			tertiary: type === 'tertiary',
			text: type === 'text',
			success: type === 'success',
			warning: type === 'warning',
			danger: type === 'danger',
			info: type === 'info',
		}"
		class="transition-all border duration-150 size-8 flex items-center justify-center rounded"
	>
		<slot name="icon" />
		<div>
			<slot />
		</div>
	</button>
</template>

<script setup>
defineProps({
	type: {
		type: String,
		default: 'primary',
	},
})
</script>

<style lang="scss" scoped>
.primary {
	@apply text-white bg-sepia-600 hover:bg-sepia-700 border-transparent;
}

.tertiary {
	@apply text-gray-400 hover:text-sepia-700 hover:text-ochre-600 hover:border-sepia-200 bg-white/25 backdrop-blur-[5px] dark:bg-white/[0.5%] dark:border-gray-300/10 border-gray-250 border hover:dark:bg-white/10;
}

.text {
	@apply border-transparent dark:text-white/50 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-700;
}
</style>
