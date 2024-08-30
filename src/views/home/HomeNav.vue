<template>
	<div class="absolute bottom-0 m-0 flex w-full justify-center text-center">
		<div class="w-full max-w-[1440px]">
			<div class="home-nav flex w-full flex-row justify-center">
				<div class="home-nav-box g-bg-100 g-border-400 m-2 flex gap-1 rounded-[10px]">
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
									<g-icon name="search" />
									<!--                                    <div class="ms-1 flex flex-row gap-1 rounded-[4px]">-->
									<!--                                        <div class="home-nav-box-inner-icon px-3 flex flex-row gap-2 h-[25px]">-->
									<!--                                            <g-icon name="command" />-->
									<!--                                            k-->
									<!--                                        </div>-->
									<!--                                    </div>-->
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
								<g-icon :name="item.icon" />
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
								<g-icon name="chat" />
							</template>
						</NButton>
						<n-popover trigger="click">
							<template #trigger>
								<NButton quaternary>
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
								</NButton>
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
		label: 'Apps',
		icon: 'apps',
		path: '/apps',
		showLabel: false
	},
	{
		label: 'Flow',
		icon: 'flow',
		path: '/workflow',
		showLabel: false
	},
	{
		label: 'New',
		icon: 'plusRound',
		path: '/plusRound',
		showLabel: true
	},
	{
		label: 'Settings',
		icon: 'settings',
		path: '/settings',
		showLabel: false
	},
	{
		label: 'Star',
		icon: 'star',
		path: '/star',
		showLabel: false
	},
	{
		label: 'Settings',
		icon: 'settings',
		path: '/settings/tags',
		showLabel: false
	}
]

const isActive = (path: string) => {
	return path === router.currentRoute.value.path ? 'primary' : 'default'
}
</script>

<style lang="scss" scoped>
.home-nav-box {
	border-radius: 16px;

	.home-nav-box-inner {
		border-radius: 14px;

		.home-nav-box-inner-icon {
			border-radius: 6px;
			min-width: 30px;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.07);
		}

		.home-nav-box-inner-icon:hover {
			background-color: var(--color-fill-2);
		}
	}
}
</style>
