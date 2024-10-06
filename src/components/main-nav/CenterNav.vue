<template>
	<nav class="g-wrapper rounded-3xl p-2">
		<div class="flex gap-1 g-base p-2 rounded-2xl">
			<NButton
				v-for="item in buttons"
				:key="item.label"
				:tertiary="true"
				:type="isActive(item.path)"
				@click="handleClick(item)"
			>
				<template #icon>
					<IconComponent
						:name="item.icon"
						:class="item.class"
					/>
				</template>
				<template v-if="item.showLabel">{{ item.label }}</template>
			</NButton>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const emit = defineEmits(['toggleAppControl'])
const router = useRouter()

const buttons = [
	{ label: 'Home', icon: 'Home', path: '/home', showLabel: false },
	{ label: 'Apps', icon: 'Apps', path: '/apps', showLabel: false },
	{
		label: 'Studio',
		icon: 'Studio',
		path: '/workflow',
		class: 'rotate-[-90deg]',
		showLabel: false,
	},
	{ label: 'New', icon: 'CirclePlus', path: '#new', showLabel: true },
	{ label: 'Settings', icon: 'Settings', path: '/settings', showLabel: false },
	{ label: 'Star', icon: 'Star', path: '/star', showLabel: false },
	{
		label: 'Tags',
		icon: 'Tags',
		path: '/settings/tags',
		showLabel: false,
	},
]

const isActive = (path: string) => (path === router.currentRoute.value.path ? 'primary' : 'default')

const handleClick = (item: Record<string, unknown>) => {
	if (item.path === '#new') {
		emit('toggleAppControl')
	} else {
		router.push(item.path as string)
	}
}
</script>
