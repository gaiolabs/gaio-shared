<template>
	<GAnimatedBackground />
	<div class="fixed font-mono right-0 bottom-0 bg-black text-[#0f0] p-1">
		<h1>TestView</h1>
		<div class="flex gap-1">
			<button
				v-if="!isDark"
				class="bg-[#0f0] px-2 text-black"
				@click="toggleDark()"
			>
				Set Dark Mode
			</button>
			<button
				v-else
				class="bg-[#0f0] px-2 text-black"
				@click="toggleDark()"
			>
				Set Light Mode
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import GAnimatedBackground from '@/components/GAnimatedBackground.vue'
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
