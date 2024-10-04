<template>
	<nav class="flex items-center gap-3 border-r border-gray-200 rounded-2xl p-2 pl-3 h-12 g-wrapper">
		<img
			:src="logoImage"
			alt="'Gaio Data OS' logo"
			class="h-8"
		/>

		<button
			class="g-base rounded-lg px-2 py-1 flex gap-4 items-center"
			@click="useCommandKStore().show = true"
		>
			<IconComponent name="Search" />
			<ul class="flex gap-1">
				<kbd
					class="kbd-style"
					:class="{ pressed: isCtrlPressed }"
				>
					Ctrl
				</kbd>
				<kbd
					class="kbd-style"
					:class="{ pressed: isKPressed }"
				>
					K
				</kbd>
			</ul>
		</button>
	</nav>
</template>

<script setup lang="ts">
import { useCommandKStore } from '@/stores'
import { useDark, useMagicKeys } from '@vueuse/core'
const isDark = useDark()
const logoImage = computed(() => (isDark.value ? '/gaio-mini-dark.png' : '/gaio-mini-light.png'))

const keys = useMagicKeys()
const isCtrlPressed = keys.ctrl
const isKPressed = keys.k
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
