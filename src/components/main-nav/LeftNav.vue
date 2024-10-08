<template>
	<nav class="flex items-center gap-3 border-r border-gray-200 rounded-2xl px-2 py-0 h-12 g-wrapper">
		<img
			:src="logoImage"
			alt="'Gaio Data OS' logo"
			class="h-8"
		/>

		<button
			class="g-base rounded-lg px-2 py-1 flex gap-2 items-center relative group min-w-32 lg:min-w-36 shadow-none group"
			@click="useCommandKStore().show = true"
		>
			<IconComponent
				name="Search"
				class="text-gray-500 dark:text-gray-500 group-hover:dark:text-gray-300 group-hover:text-gray-800 transition-colors duration-150"
			/>
			<div
				class="text-gray-350 dark:text-gray-550 group-hover:text-gray-500 group-hover:dark:text-gray-400 relative top-px transition-colors text-sm duration-150 leading-none"
			>
				{{ $t('search') }}...
			</div>

			<span
				class="absolute left-4 right-3 bottom-[-2px] h-[1px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition duration-150 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 z-[-1]"
			></span>
			<span
				class="overflow-hidden absolute inset-0 transition origin-bottom duration-150 opacity-1 scale-0 group-hover:opacity-100 group-hover:scale-100 z-[-1]"
			>
				<span
					class="absolute inset-x-4 -bottom-2 h-full bg-gradient-to-t dark:from-ochre-500/5 from-sepia-500/10 to-transparent blur rounded-t-full z-[-1]"
				></span>
			</span>
		</button>
	</nav>
</template>

<script setup lang="ts">
import { useCommandKStore } from '@/stores'
import { useDark } from '@vueuse/core'
const isDark = useDark()
const logoImage = computed(() => (isDark.value ? '/gaio-mini-dark.png' : '/gaio-mini-light.png'))
</script>

<style scoped>
.kbd-style {
	transition:
		background-color 0.2s,
		color 0.2s;
	@apply inline-flex justify-center items-center px-2 bg-white border border-gray-200 font-mono text-sm text-gray-800 shadow rounded-md;
	@apply dark:bg-gray-800 dark:border-gray-700 dark:text-white;
}

.pressed {
	@apply shadow-sm translate-y-[1px];
}
</style>
