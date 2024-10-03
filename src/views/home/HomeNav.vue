<template>
	<div class="absolute bottom-0 m-0 flex w-full justify-center text-center">
		<div class="w-full max-w-[1440px]">
			<nav
				id="home-nav"
				class="flex w-full flex-row justify-center"
			>
				<div
					id="home-nav-box"
					class="g-bg-100 g-border-400 m-2 flex gap-1 rounded-xl"
				>
					<div class="flex items-center gap-2 py-3 ps-4">
						<img
							v-if="isDark"
							:src="gaioMiniDark"
							style="height: 30px"
							alt="logo"
						/>
						<img
							v-else
							:src="gaioMini"
							style="height: 30px"
							alt="logo"
						/>
						<div class="home-nav-box-inner flex items-center">
							<NButton
								tertiary
								@click="useCommandKStore().show = true"
							>
								<div class="flex items-center">
									<IconComponent name="Search" />
								</div>
							</NButton>
						</div>
					</div>
					<div class="flex h-full items-center">
						<NDivider vertical />
					</div>
					<div class="mx-3 flex items-center gap-2 py-3">
						<NButton
							v-for="item of buttons"
							:key="item.label"
							tertiary
							:type="isActive(item.path)"
							@click="goToPath(item)"
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
					<div class="flex h-full items-center">
						<NDivider vertical />
					</div>
					<div class="flex items-center gap-2 py-3 pe-2">
						<NButton
							size="small"
							tertiary
						>
							<template #icon>
								<IconComponent name="Chat" />
							</template>
						</NButton>
						<NPopover trigger="click">
							<template #trigger>
								<NButton quaternary>
									<NAvatar
										:src="avatar"
										:alt="avatar"
										circle
										size="small"
									/>
									<div class="ms-2">
										<div class="text-xs lowercase">
											{{ formattedDate }}
										</div>
										<div class="">
											{{ formattedTime }}
										</div>
									</div>
								</NButton>
							</template>
							<div>
								<home-account />
							</div>
						</NPopover>
					</div>
				</div>
			</nav>
		</div>
		<app-control
			v-if="showAppControl"
			@close="showAppControl = false"
		/>
	</div>
</template>

<script setup lang="ts">
import avatar from '@/assets/images/avatar.png'
import gaioMiniDark from '@/assets/images/gaio-mini-dark.png'
import gaioMini from '@/assets/images/gaio-mini-light.png'
import { useCommandKStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import HomeAccount from '@/views/home/HomeAccount.vue'
import { useDark } from '@vueuse/core'
import { NAvatar } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = useDark()

const showAppControl = ref(false)

const goToPath = (item: Record<string, unknown>) => {
	if (item.path === '#new') {
		showAppControl.value = !showAppControl.value
		return
	}
	router.push(item.path)
}

const buttons = [
	{
		label: 'Home',
		icon: 'Home',
		path: '/home',
		showLabel: false,
	},
	{
		label: 'Apps',
		icon: 'Apps',
		path: '/apps',
		showLabel: false,
	},
	{
		label: 'Studio',
		icon: 'Studio',
		path: '/workflow',
		class: 'rotate-[-90deg]',
		showLabel: false,
	},
	{
		label: 'New',
		icon: 'CirclePlus',
		path: '#new',
		showLabel: true,
	},
	{
		label: 'Settings',
		icon: 'Settings',
		path: '/settings',
		showLabel: false,
	},
	{
		label: 'Star',
		icon: 'Star',
		path: '/star',
		showLabel: false,
	},
	{
		label: 'Tags',
		icon: 'Tags',
		path: '/settings/tags',
		showLabel: false,
	},
]

const isActive = (path: string) => {
	return path === router.currentRoute.value.path ? 'primary' : 'default'
}

const currentDate = ref(new Date())

const formattedDate = computed(() => {
	// Format date as "Tues, 28"
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		day: 'numeric',
	}).format(currentDate.value)
})

const formattedTime = computed(() => {
	// Format time as "22:22"
	return new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(currentDate.value)
})

const interval = setInterval(() => {
	currentDate.value = new Date()
}, 60000)

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>
