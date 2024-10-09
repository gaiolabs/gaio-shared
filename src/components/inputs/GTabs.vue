<template>
	<div class="">
		<div class="flex gap-1 z-[1]">
			<button
				v-for="tab in tabs"
				:key="tab.name"
				:is-active="currentTab === tab.name"
				class="rounded-t-xl py-1 px-4 border relative"
				:class="[
					currentTab === tab.name ?
						'border-gray-200 dark:border-gray-800 border-b-0 bg-white dark:bg-gray-900'
					:	'border-transparent bg-transparent',
				]"
				bottomless
				@click="selectTab(tab.name)"
			>
				{{ tab.label }}
				<span
					v-if="currentTab === tab.name"
					class="absolute bottom-0 left-0 w-full h-1 translate-y-[2px] bg-white dark:bg-gray-900 z-[3]"
				></span>
				<div
					v-if="tab.name !== tabs[0].name"
					class="-scale-x-100 absolute left-0 bottom-[-1px] z-[3] -translate-x-full"
					:class="currentTab === tab.name ? 'text-white dark:text-gray-900' : 'text-transparent'"
				>
					<svg
						class="h-2 w-2"
						viewBox="0 0 10 10"
						fill="currentColor"
					>
						<path
							class="fil0"
							d="M0 0l0 12 12 0c-6,0 -12,-6 -12,-12z"
						/>
					</svg>
				</div>
				<div
					class="absolute right-0 bottom-[-1px] z-[3] translate-x-full"
					:class="
						currentTab === tab.name ?
							'text-white dark:text-gray-900'
						:	'text-transparent group-hover:text-white/50 group-hover:dark:text-gray-900'
					"
				>
					<svg
						class="h-2 w-2"
						viewBox="0 0 10 10"
						fill="currentColor"
					>
						<path
							class="fil0"
							d="M0 0l0 12 12 0c-6,0 -12,-6 -12,-12z"
						/>
					</svg>
				</div>
			</button>
		</div>

		<div
			class="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 relative z-[2]"
			:class="isTheFirstOneActive ? 'rounded-tl-none' : ''"
		>
			<slot />
			<footer
				v-if="$slots.footer"
				class="mt-4 border-t border-gray-200 dark:border-white/10 pt-4"
			>
				<slot name="footer"></slot>
			</footer>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, provide, defineProps, defineEmits } from 'vue'

interface Tab {
	name: string
	label: string
}

const props = defineProps<{
	modelValue?: string
}>()

const emit = defineEmits(['update:modelValue'])

const currentTab = ref<string>(props.modelValue || '')

const tabs = reactive<Tab[]>([])

const selectTab = (name: string) => {
	currentTab.value = name
}

const registerTab = (tab: Tab) => {
	tabs.push(tab)
	if (!currentTab.value) {
		currentTab.value = tab.name
	}
}

const isTheFirstOneActive = computed(() => {
	if (!currentTab.value) return false
	if (!tabs.length) return false
	return currentTab.value === tabs[0].name
})

provide('registerTab', registerTab)
provide('currentTab', currentTab)

watch(
	() => props.modelValue,
	(val) => {
		currentTab.value = val || ''
	},
)

watch(currentTab, (val) => {
	emit('update:modelValue', val)
})
</script>
