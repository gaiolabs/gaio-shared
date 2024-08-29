<template>
	<div
		ref="settingsWrapper"
		class="settings-view flex h-full flex-col"
	>
		<div class="home flex justify-center">
			<div class="mx-2 w-full max-w-[1440px]">
				<div class="mt-4">
					<div class="g-text-700 flex items-center gap-2 text-2xl font-semibold">
						<slot name="title"></slot>
					</div>
					<div class="g-bg-600 my-2 h-[2px] shadow-sm"></div>
				</div>
			</div>
		</div>
		<div
			class="home mx-2 flex justify-center"
			:style="{ height: scrollHeight }"
		>
			<div
				class="h-full w-full max-w-[1440px] overflow-auto pb-[70px]"
				:style="{ height: scrollHeight, maxHeight: scrollHeight }"
			>
				<slot />
			</div>
		</div>
		<settings-nav />
	</div>
</template>
<script setup lang="ts">
import SettingsNav from '@/views/settings/SettingsNav.vue'
import { useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

const { height } = useWindowSize()

const settingsWrapper = ref()

const scrollHeight = computed(() => {
	return height.value ? height.value - 60 + 'px !important' : 'initial'
})
</script>
