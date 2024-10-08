<template>
	<nav class="flex items-center gap-1 g-wrapper h-12 rounded-2xl px-3">
		<GButton
			v-for="button in buttons"
			:key="button.label"
			type="tertiary"
			:class="[buttonCursorClass(button), button.showLabel ? 'mx-2 !py-0' : '!px-3 h-full']"
			:is-active="isActive(button.path)"
			@click="handleClick(button)"
			@mouseenter="button.isHovered = true"
			@mouseleave="button.isHovered = false"
		>
			<template v-if="!button.showLabel">
				<IconComponent
					:name="button.icon"
					:class="[isActive(button.path) ? 'text-gray-800 dark:text-white' : '']"
					class="text-gray-600 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white"
					:secondaryfill="[
						button.isHovered || isActive(button.path) ?
							isDark ? '#d99554'
							:	'#d27c40'
						:	'currentColor',
					]"
				/>
			</template>
			<template v-else>
				<div class="flex items-center gap-2 bg-red-500 g-base px-3 py-1 -mx-4 rounded-md">
					<IconComponent
						:name="button.icon"
						:class="[isActive(button.path) ? 'text-gray-800 dark:text-white' : '']"
						class="text-gray-600 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white"
						:secondaryfill="[
							button.isHovered || isActive(button.path) ?
								isDark ? '#d99554'
								:	'#d27c40'
							:	'currentColor',
						]"
					/>
					<span>{{ button.label }}</span>
				</div>
			</template>
		</GButton>
	</nav>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import GButton from '@/components/inputs/GButton.vue'
import { useDark } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['toggleAppControl'])

const router = useRouter()
const isDark = useDark()

const buttons = ref([
	{ label: 'Home', icon: 'Home', path: '/home', showLabel: false, isHovered: false },
	{ label: 'Apps', icon: 'Apps', path: '/apps', showLabel: false, isHovered: false },
	// { label: 'Studio', icon: 'Studio', path: '/workflow', showLabel: false, isHovered: false },
	{ label: 'New', icon: 'CirclePlus', path: '#new', showLabel: true, isHovered: false },
	{ label: 'Settings', icon: 'Settings', path: '/settings', showLabel: false, isHovered: false },
	// { label: 'Star', icon: 'Star', path: '/star', showLabel: false, isHovered: false },
	// { label: 'Tags', icon: 'Tags', path: '/settings/tags', showLabel: false, isHovered: false },
	{ label: 'More', icon: 'Menu', path: '#more', showLabel: false, isHovered: false },
])

const currentPath = computed(() => router.currentRoute.value.path)

const isActive = (path: string): boolean => currentPath.value === path

const handleClick = (button: Button): void => {
	if (button.path === '#new') {
		emit('toggleAppControl')
	} else {
		router.push(button.path)
	}
}

const buttonCursorClass = (button: Button): string => (isActive(button.path) ? 'cursor-default' : 'cursor-pointer')
</script>

<style lang="scss" scoped>
.active {
	@apply text-black dark:text-white;
}

.with-label {
	@apply text-gray-600 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white;
}

.without-label {
	@apply text-gray-500 dark:text-gray-500 group-hover:text-sepia-800 dark:group-hover:text-white;
}
</style>
