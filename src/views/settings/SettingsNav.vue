<template>
	<div class="absolute bottom-0 m-0 flex w-full justify-center text-center">
		<div class="w-full max-w-[1440px]">
			<div class="settings-nav flex w-full flex-row justify-center">
				<div class="nav-box g-bg-1 g-border-400 m-2 flex gap-1 rounded-[10px]">
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
						<div class="nav-box-inner flex items-center">
							<n-button
								size="small"
								quaternary
								@click="useCommandKStore().show = true"
							>
								<div class="flex items-center">
									<g-icon name="search" />
								</div>
							</n-button>
						</div>
					</div>
					<div class="flex h-full items-center">
						<n-divider vertical />
					</div>
					<div class="mx-3 flex items-center gap-2 py-2">
						<n-tooltip
							v-for="item of buttons"
							:key="item.label"
						>
							<template #trigger>
								<n-button
									size="small"
									tertiary
									:type="isActive(item.path)"
									@click="goToPath(item)"
								>
									<template #icon>
										<g-icon :name="item.icon" />
									</template>
									<template v-if="item.showLabel">{{ item.label }}</template>
								</n-button>
							</template>
							{{ $t(item.label) }}
						</n-tooltip>
					</div>
					<div class="flex h-full items-center">
						<n-divider vertical />
					</div>
					<div class="flex items-center gap-1 p-2">
						<n-button
							size="small"
							tertiary
						>
							<template #icon>
								<g-icon name="chat" />
							</template>
						</n-button>
						<n-popover trigger="click">
							<template #trigger>
								<n-button
									size="small"
									quaternary
								>
									<n-avatar
										:src="avatar"
										:alt="avatar"
										circle
										size="tiny"
									/>
									<div class="ms-2">
										<div class="text-[9px] font-thin lowercase">Seg, 23</div>
										<div class="text-[11px]">22:22</div>
									</div>
								</n-button>
							</template>
							<div>
								<home-account />
							</div>
						</n-popover>
					</div>
				</div>
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
		icon: 'home',
		path: '/home',
		showLabel: false
	},
	{
		label: 'tags',
		icon: 'shieldAccount',
		path: '/settings/tags',
		showLabel: false
	},
	{
		label: 'user',
		icon: 'user',
		path: '/settings/users',
		showLabel: false
	},
	{
		label: 'sources',
		icon: 'source',
		path: '/settings/sources',
		showLabel: false
	},
	{
		label: 'bucket',
		icon: 'bucket',
		path: '/settings/bucket',
		showLabel: false
	},

	{
		label: 'logs',
		icon: 'settingsLogs',
		path: '/settings/logs',
		showLabel: false
	},
	{
		label: 'monit',
		icon: 'monit',
		path: '/settings/monit',
		showLabel: false
	},

	{
		label: 'appShare',
		icon: 'appShare',
		path: '/settings/app',
		showLabel: false
	},
	{
		label: 'setup',
		icon: 'setupSettings',
		path: '/settings/setup',
		showLabel: false
	}
]

const isActive = (path: string) => {
	return path === router.currentRoute.value.path ? 'primary' : 'default'
}
</script>

<style lang="scss" scoped>
.nav-box {
	border-radius: 16px;

	.nav-box-inner {
		border-radius: 14px;

		.nav-box-inner-icon {
			border-radius: 6px;
			min-width: 30px;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.07);
		}

		.nav-box-inner-icon:hover {
			background-color: var(--color-fill-2);
		}
	}
}
</style>
