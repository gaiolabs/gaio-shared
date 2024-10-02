<template>
	<button
		:class="{
			// Colors
			primary: type === 'primary',
			secondary: type === 'secondary',
			tertiary: type === 'tertiary',
			text: type === 'text',
			success: type === 'success',
			warning: type === 'warning',
			danger: type === 'danger',
			info: type === 'info',

			// Sizes
			tiny: size === 'tiny',
			small: size === 'small',
			medium: size === 'medium',
			large: size === 'large',
			xlarge: size === 'xlarge',
		}"
		class="transition-all border duration-150 flex items-center justify-center rounded"
	>
		<slot name="icon" />
		<div>
			<slot />
		</div>
	</button>
</template>

<script lang="ts" setup>
defineProps({
	type: {
		type: String,
		default: 'primary',
	},
	size: {
		type: String,
		default: 'medium',
	},
})
</script>

<style lang="scss" scoped>
// colors
.primary {
	@apply text-white dark:text-black bg-sepia-600 dark:bg-ochre-500 hover:bg-sepia-700 hover:dark:bg-ochre-600 border-transparent;
}

.secondary {
	@apply bg-white border-gray-300 dark:border-gray-300/10;
}

.tertiary {
	@apply text-gray-400 hover:text-sepia-700 hover:dark:text-ochre-500 hover:border-sepia-200 bg-white/25 backdrop-blur-[5px] dark:bg-white/[0.5%] dark:border-gray-300/10 border-gray-250 border hover:dark:bg-white/10;
}

.text {
	@apply border-transparent dark:text-white/50 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-700;
}

// sizes
.tiny {
	@apply px-2 py-0.5 rounded text-xs;
}

.small {
	@apply px-2 gap-1 py-1 rounded-md text-sm;
}

.medium {
	@apply px-4 py-1 rounded-lg text-base;
}

.large {
	@apply px-5 py-2 rounded-xl text-lg;
}

.xlarge {
	@apply px-6 py-3 rounded-2xl text-xl;
}
</style>
