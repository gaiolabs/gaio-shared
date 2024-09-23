<template>
	<div class="absolute bottom-0 m-0 flex w-full justify-center text-center">
		<div class="w-full max-w-[1440px]">
			<div class="settings-nav flex w-full flex-row justify-center">
				<nav
					id="nav-box"
					class="g-bg-1 g-border-400 m-2 flex gap-1 rounded-[10px]"
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
						<div
							id="nav-box-inner"
							class="flex items-center"
						>
							<NButton
								size="small"
								quaternary
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
					<div class="mx-3 flex items-center gap-2 py-2">
						<NTooltip
							v-for="item of buttons"
							:key="item.label"
						>
							<template #trigger>
								<NButton
									size="small"
									tertiary
									:type="isActive(item.path)"
									@click="goToPath(item)"
								>
									<template #icon>
										<IconComponent :name="item.icon" />
									</template>
									<template v-if="item.showLabel">{{ item.label }}</template>
								</NButton>
							</template>
							{{ $t(item.label) }}
						</NTooltip>
					</div>
					<div class="flex h-full items-center">
						<NDivider vertical />
					</div>
					<div class="flex items-center gap-1 p-2">
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
				</nav>
			</div>
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
import gaioMini from '@/assets/images/gaio-mini.png'
import { useCommandKStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import HomeAccount from '@/views/home/HomeAccount.vue'
import { useDark } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = useDark()

const showAppControl = ref(false)

const goToPath = (item: Record<string, unknown>) => {
	if (item.path === '/plusRound') {
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
		label: 'tags',
		icon: 'Tags',
		path: '/settings/tags',
		showLabel: false,
	},
	{
		label: 'user',
		icon: 'User',
		path: '/settings/users',
		showLabel: false,
	},
	{
		label: 'sources',
		icon: 'DataSources',
		path: '/settings/sources',
		showLabel: false,
	},
	{
		label: 'bucket',
		icon: 'Bucket',
		path: '/settings/bucket',
		showLabel: false,
	},

	{
		label: 'logs',
		icon: 'Logs',
		path: '/settings/logs',
		showLabel: false,
	},
	{
		label: 'monitor',
		icon: 'Monitor',
		path: '/settings/monit',
		showLabel: false,
	},

	{
		label: 'appShare',
		icon: 'AppShare',
		path: '/settings/app',
		showLabel: false,
	},
	{
		label: 'setup',
		icon: 'SetupSettings',
		path: '/settings/setup',
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
