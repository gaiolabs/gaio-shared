<template>
	<div
		id="g-card"
		class="pointer-events-auto"
		:class="type"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
const { type = 'base' } = defineProps({
	type: {
		type: String as PropType<'base' | 'wrapper'>,
		default: 'card',
	},
})
</script>

<style lang="scss" scoped>
#g-card.base {
	/* Gradient Background */
	@apply bg-gradient-to-tl;
	@apply bg-white/75 from-white/30 via-gray-100/30 to-sepia-100/10;
	@apply dark:bg-gradient-to-br dark:bg-transparent dark:from-gray-750/20 dark:via-gray-800/20 dark:to-gray-700/[30%];

	/* Borders */
	@apply border border-white dark:border-white/10;

	/* Shadows */
	@apply shadow-md shadow-gray-950/5;

	/* Rings */
	@apply ring-1 ring-gray-750/[.125];

	/* Backdrop Filter */
	@apply backdrop-blur;
}

#g-card.wrapper {
	/* Background */
	@apply bg-white/75 dark:bg-gray-850/10;
	@apply bg-gradient-to-r from-sepia-100/30 dark:from-gray-700/25 via-gray-100/40 dark:via-gray-800/20 to-sepia-200/10 dark:to-ochre-950/[1%];

	/* Borders */
	@apply border border-white/50 dark:border-white/[2.5%];

	/* Shadows */
	@apply shadow-lg shadow-gray-800/5;

	/* Rings */
	@apply ring-1 ring-gray-700/[.05];

	/* Backdrop Filter */
	@apply backdrop-blur-xl;
}
</style>
