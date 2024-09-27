<template>
	<a
		id="powered-by"
		target="_blank"
		href="https://gaio.io"
		class="relative block group -ml-8 pl-8 pr-14 -mb-8 pb-8"
	>
		<small class="text-xs ml-1 dark:text-gray-500 text-gray-500 z-10">Powered by</small>

		<img
			class="w-[100px] h-[42px] object-contain object-left bg-red-blue-500 z-10"
			:src="isDark ? logoDarkUrl : logoUrl"
			:alt="whiteLabelAlt"
		/>
		<div
			id="powered-by-box-backdrop"
			class="block transition-all duration-300 ease-in-out group-hover:rotate-[2deg] rotate-[-6deg] -translate-x-12 translate-y-12 fixed w-64 h-44 bottom-0 left-0 z-[-1] rounded-[2rem] backdrop-blur-lg"
		></div>
		<div
			id="powered-by-box"
			class="block transition-all duration-300 ease-in-out group-hover:rotate-[2deg] rotate-[-6deg] g-gradient-border -translate-x-12 translate-y-12 filter fixed w-64 h-44 bottom-0 left-0 z-[-1] p-[3px] rounded-[2rem]"
		>
			<div
				class="bg-gradient-to-tr from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 w-full h-full rounded-[26px]"
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
