<template>
	<a
		id="powered-by"
		target="_blank"
		href="https://gaio.io"
		class="relative block group -ml-8 pl-8 pr-14 -mb-8 pb-8"
	>
		<small class="text-xs ml-1 dark:text-gray-500 text-gray-500 z-10">Powered by</small>

		<img
			class="w-[100px] dark:opacity-100 opacity-0 !transition-all duration-[600ms] relative h-[42px] object-contain object-left bg-red-blue-500 z-10"
			:src="logoDark"
			alt="Gaio Data OS"
		/>
		<img
			class="w-[100px] absolute dark:opacity-0 opacity-100 !transition-all duration-[600ms] translate-y-[-100%] h-[42px] object-contain object-left bg-red-blue-500 z-10"
			:src="logo"
			alt="Gaio Data OS"
		/>

		<!-- <div
			id="powered-by-box-backdrop"
			class="block transition-all duration-300 ease-in-out group-hover:rotate-[2deg] rotate-[-6deg] -translate-x-12 translate-y-12 fixed w-64 h-44 bottom-0 left-0 z-[-1] rounded-[2rem] backdrop-blur-lg"
		></div>
		<div
			id="powered-by-box"
			class="block transition-all duration-300 ease-in-out group-hover:rotate-[2deg] rotate-[-6deg] g-gradient-border -translate-x-12 translate-y-12 filter fixed w-64 h-44 bottom-0 left-0 z-[-1] p-[3px] rounded-[2rem]"
		>
			<div class="bg-white dark:bg-gray-900 !transition-all !duration-[600ms] w-full h-full rounded-[26px]"></div>
		</div> -->
	</a>
</template>

<script setup lang="ts">
import logoDark from '@/assets/images/gaio-logo-dark.png'
import logo from '@/assets/images/gaio-logo-light.png'
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>
