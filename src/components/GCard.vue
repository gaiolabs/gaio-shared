<template>
	<div id="g-card">
		<slot />
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
#g-card {
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
</style>
