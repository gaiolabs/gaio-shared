<template>
	<header
		class="w-full flex mx-auto max-w-[1440px] ultrawide:max-w-[1920px] w-full pb-4 gap-4 justify-between items-center border-b dark:border-gray-300/10 border-sepia-900/10"
	>
		<div class="flex gap-2 items-center">
			<IconComponent
				v-if="icon"
				class="size-10"
				:strokewidth="1"
				:secondaryfill="isDark ? '#eaa869' : '#eea565'"
				:name="icon"
			/>

			<h3
				class="text-xl"
				:class="{ 'pl-2': !icon }"
			>
				{{ title }}
			</h3>
		</div>
		<div class="g-base p-2 rounded-2xl flex gap-2">
			<slot />
		</div>
	</header>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import { useDark } from '@vueuse/core'

const isDark = useDark()

defineProps({
	title: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		default: null,
	},
})
</script>

<style scoped></style>
