<template>
	<header
		class="w-full border-b pb-4 border-sepia-900/10 dark:border-white/10 flex mx-auto max-w-[1444px] -mt-px ultrawide:max-w-[1920px] w-full gap-4 justify-between items-center"
	>
		<div class="flex gap-2 items-center">
			<div class="g-base rounded-lg">
				<IconComponent
					v-if="icon"
					class="size-8"
					:strokewidth="1"
					:secondaryfill="isDark ? '#eaa869' : '#eea565'"
					:name="icon"
				/>
			</div>

			<h3
				class="text-xl"
				:class="{ 'pl-2': !icon }"
			>
				{{ title }}
			</h3>
		</div>
		<div class="flex gap-2 g-wrapper p-2 rounded-2xl">
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
