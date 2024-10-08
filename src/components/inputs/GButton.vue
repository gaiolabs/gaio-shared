<template>
	<button
		:class="[type, size, square ? 'square' : '']"
		class="transition-all border duration-150 flex items-center justify-center rounded group relative z-[1]"
	>
		<slot
			class="z-[3]"
			name="icon"
		/>
		<div class="z-[3]">
			<slot />
		</div>
		<span
			v-if="showLine && !noLine"
			id="button-hover-line"
			class="absolute left-0 right-0 bottom-[-1px] h-[1px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition-all duration-300 z-[2]"
			:class="isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'"
		/>
		<span
			v-if="showLine"
			id="button-hover-background"
			class="overflow-hidden absolute inset-0 transition origin-bottom duration-150 group-hover:opacity-100 group-hover:dark:opacity-100 group-hover:scale-100 z-[2]"
			:class="isActive ? 'opacity-30 dark:opacity-20 scale-100' : 'opacity-0 scale-0'"
		>
			<span
				class="absolute inset-2 bottom-0 bg-gradient-to-t blur rounded-t-full z-[2]"
				:class="
					isActive ? 'dark:from-ochre-500/100 from-sepia-500/100 to-sepia-500/0'
					: type === 'primary' ? 'dark:from-ochre-400/100 from-sepia-300/100 to-sepia-100/0'
					: 'dark:from-ochre-500/100 from-sepia-500/100 to-sepia-500/0'
				"
			/>
		</span>
	</button>
</template>

<script lang="ts" setup>
const { type, size, square, noLine, isActive } = defineProps({
	type: {
		type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'text' | 'success' | 'warning' | 'danger' | 'info'>,
		default: 'primary',
	},
	size: {
		type: String as PropType<'tiny' | 'small' | 'medium' | 'large' | 'xlarge'>,
		default: 'medium',
	},
	square: {
		type: Boolean,
		default: false,
	},
	noLine: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
})

const showLine = computed(
	() => type !== 'text' && type !== 'success' && type !== 'warning' && type !== 'danger' && type !== 'info',
)
</script>

<style lang="scss" scoped>
.primary {
	@apply text-white;

	/* Gradient Background */
	@apply bg-gradient-to-tl;
	@apply from-sepia-800 via-sepia-700 to-sepia-500;
	@apply dark:from-ochre-800 dark:via-ochre-700 dark:to-ochre-500;

	/* Borders */
	@apply border border-sepia-700 dark:border-ochre-700;

	/* Shadows */
	@apply shadow shadow-gray-950/5 hover:shadow-md;

	/* Rings */
	@apply ring-1 ring-gray-750/[.125];
}

.secondary {
	// @apply text-gray-500 hover:text-sepia-700 hover:dark:text-ochre-500 hover:border-sepia-200 bg-white/25 backdrop-blur-[5px] dark:bg-white/[0.5%] dark:border-gray-300/10 border-gray-250 border hover:dark:bg-white/[0.5%];

	/* Gradient Background */
	@apply bg-gradient-to-tl;
	@apply bg-white/75 from-white/30 via-gray-100/30 to-sepia-100/10;
	@apply dark:bg-gradient-to-br dark:bg-transparent dark:from-gray-750/20 dark:via-gray-800/20 dark:to-gray-700/[30%];

	/* Borders */
	@apply border border-white dark:border-white/10;

	/* Shadows */
	@apply shadow shadow-gray-950/5 hover:shadow-md;

	/* Rings */
	@apply ring-1 ring-gray-750/[.125];
}

.tertiary {
	@apply border-none text-gray-500 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400;
}

.text {
	@apply border-transparent dark:text-white/50 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-700;
}

// sizes
.tiny {
	@apply px-2 py-0.5 rounded text-xs;
	&.square {
		@apply p-0.5;
	}
}

.small {
	@apply px-2 gap-1 py-1 rounded-md text-sm;
	&.square {
		@apply p-1;
	}
}

.medium {
	@apply px-4 py-1 rounded-lg text-base;
	&.square {
		@apply p-1;
	}
}

.large {
	@apply px-5 py-2 rounded-xl text-lg;
	&.square {
		@apply p-2;
	}
}

.xlarge {
	@apply px-6 py-3 rounded-2xl text-xl;
	&.square {
		@apply p-3;
	}
}
</style>
