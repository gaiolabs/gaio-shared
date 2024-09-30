<template>
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
			class="dark:opacity-10 opacity-20 bg-cover w-[400vh] h-[400vh] bg"
		></div>
	</div>
</template>

<script setup>
import bgDark from '@/assets/images/bg-dark.png'
import bg from '@/assets/images/bg-light.png'
import pattern from '@/assets/images/pattern.png'
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
