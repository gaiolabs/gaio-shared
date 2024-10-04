<template>
	<nav class="flex items-center gap-3 border-r border-gray-200 rounded-2xl p-2 pl-3 h-12 g-wrapper">
		<img
			:src="logoImage"
			alt="'Gaio Data OS' logo"
			class="h-8"
		/>

		<button
			class="g-base rounded-lg px-2 py-1 flex gap-4 items-center relative group"
			@click="useCommandKStore().show = true"
		>
			<IconComponent name="Search" />
			<ul class="flex gap-1">
				<kbd
					v-if="os === 'mac'"
					class="kbd-style"
					:class="{ pressed: isMetaPressed }"
				>
					⌘ Cmd
				</kbd>
				<kbd
					v-else
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

			<span
				class="absolute left-4 right-4 bottom-[-2px] h-[2px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition duration-150 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 z-[-1]"
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
import { useDark, useMagicKeys } from '@vueuse/core'
const isDark = useDark()
const logoImage = computed(() => (isDark.value ? '/gaio-mini-dark.png' : '/gaio-mini-light.png'))

const os = computed(() => {
	const platform = navigator.userAgent
	if (/Mac|iPad|iPhone|iPod/.test(platform)) {
		return 'mac'
	} else if (/Win/.test(platform)) {
		return 'windows'
	} else {
		return 'other'
	}
})

const keys = useMagicKeys()
const isMetaPressed = keys.meta
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
