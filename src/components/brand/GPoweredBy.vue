<template>
	<a
		id="powered-by"
		href="https://gaio.io"
		class="relative block group -ml-8 pl-8 pr-14 -mb-8 pb-8"
	>
		<small class="text-xs font-medium ml-1 dark:text-paper-900 text-carbon-900 z-10">Powered by</small>

		<img
			class="w-[100px] h-[42px] object-contain object-left bg-red-blue-500 z-10"
			:src="isDark ? logoDarkUrl : logoUrl"
			:alt="whiteLabelAlt"
		/>
		<div
			id="powered-by-box"
			style="--tw-drop-shadow: drop-shadow(0 15px 25px rgb(0 0 0 / 0.075))"
			class="block transition-all duration-300 ease-in-out group-hover:rotate-[182deg] bg-gradient-to-bl rotate-[174deg] dark:via-[#2e251f] dark:from-[#2e251f] dark:to-[#4d372c] from-[#E9C9B5] -translate-x-12 translate-y-8 drop-shadow-2xl via-[#E9C9B5] to-[#ffe6d6] fixed w-64 h-40 bottom-0 left-0 z-[-1] p-[2px] rounded-2xl"
		>
			<div
				class="bg-gradient-to-bl from-paper-400 to-paper-100 dark:from-carbon-400 dark:to-carbon-100 w-full h-full rounded-[13px]"
			></div>
		</div>
	</a>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark()
const logoUrl = '/gaio-logo-light.png'
const logoDarkUrl = '/gaio-logo-dark.png' // not needed, it will fallback to logoUrl
const whiteLabelAlt = 'Gaio Data OS'
</script>
