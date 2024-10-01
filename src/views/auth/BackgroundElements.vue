<template>
	<!-- <pre class="fixed text-xs text-[#0f0] top-0 left-0 p-1 bg-black z-50">
		{{ route }}
	</pre
	> -->
	<div
		id="background-elements"
		:style="{ opacity: opacity }"
		class="absolute inset-0 z-[-1] overflow-hidden absolute !transition-all !duration-300 w-screen h-screen"
	>
		<div
			id="bg-dark"
			:style="{ backgroundImage: `url(${bgDark})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1]"
		></div>
		<div
			id="bg-light"
			:style="{ backgroundImage: `url(${bg})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1] dark:opacity-0 opacity-100 !duration-[600ms] !transition-all"
		></div>
		<div
			id="bg-pattern-wrapper"
			class="absolute bottom-0 left-0 translate-x-[-52%] translate-y-[58%] absolute z-[-1]"
		>
			<div
				id="bg-pattern"
				:style="{ backgroundImage: `url(${pattern})` }"
				:class="opacity === 1 ? 'dark:opacity-10 opacity-15' : 'dark:opacity-25 opacity-35'"
				class="bg-cover w-[400vh] h-[400vh] bg"
			></div>
		</div>
	</div>
</template>

<script setup>
import bgDark from '@/assets/images/bg-dark.png'
import bg from '@/assets/images/bg-light.png'
import pattern from '@/assets/images/pattern.png'
import { useDark } from '@vueuse/core'
import { useRoute } from 'vue-router'

const isDark = useDark()
const route = useRoute()
const opacity = computed(() => {
	return (
		route.path.startsWith('/auth') ? 1
		: isDark ? 0.4
		: 0.3
	)
})
</script>

<style scoped>
#bg-pattern {
	animation: spin calc(15 * 60 * 1s) infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
