<template>
	<button
		:class="[type, size, square ? 'square' : '']"
		class="transition-all border duration-150 flex items-center justify-center rounded group relative"
	>
		<slot name="icon" />
		<div>
			<slot />
		</div>
		<span
			v-if="showLine && !noLine"
			id="button-hover-line"
			class="absolute left-0 right-0 bottom-[-2px] h-[2px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition duration-150 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 z-[-1]"
		/>
		<span
			v-if="showLine"
			id="button-hover-background"
			class="overflow-hidden absolute inset-0 transition origin-bottom duration-150 opacity-0 scale-0 group-hover:opacity-30 group-hover:dark:opacity-15 group-hover:scale-100 z-[-1]"
		>
			<span
				class="absolute inset-2 bottom-0 bg-gradient-to-t dark:from-ochre-500/100 from-sepia-500/100 to-sepia-500/0 blur rounded-t-full z-[-1]"
			/>
		</span>
	</button>
</template>

<script lang="ts" setup>
const { type, size, square, noLine } = defineProps({
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
})

const showLine = computed(
	() => type !== 'text' && type !== 'success' && type !== 'warning' && type !== 'danger' && type !== 'info',
)
</script>

<style lang="scss" scoped>
// colors
.primary {
	@apply text-white dark:text-black bg-sepia-600 dark:bg-ochre-500 hover:bg-sepia-700 hover:dark:bg-ochre-600 border-transparent;
}

.secondary {
	@apply text-gray-500 hover:text-sepia-700 hover:dark:text-ochre-500 hover:border-sepia-200 bg-white/25 backdrop-blur-[5px] dark:bg-white/[0.5%] dark:border-gray-300/10 border-gray-250 border hover:dark:bg-white/[0.5%];
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
