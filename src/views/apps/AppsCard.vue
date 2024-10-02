<template>
	<article
		id="apps-card"
		class="border group w-full cursor-pointer rounded-xl"
		:class="[
			['border-gray-800/10 hover:border-gray-800/20'], // borders
			['dark:border-gray-300/5 hover:dark:border-white/15'], // borders dark

			['bg-white/35 hover:bg-white/55'], // background
			['dark:bg-white/5 hover:dark:bg-white/[7.5%]'], // background dark

			['shadow shadow-gray-800/5 hover:shadow-md dark:shadow-md'], // shadow
			['transition-all duration-300'], // transition
		]"
	>
		<div class="flex flex-col gap-5 p-2">
			<header class="flex items-start gap-2 w-full">
				<GAppIcon
					class="text-xl size-10"
					:name="app.options.icon"
					:color="app.options.color"
				/>
				<div class="flex flex-1 flex-col">
					<h6 class="flex flex-1">{{ app.appName }}</h6>

					<small class="dark:text-white/50 text-black/50 text-xs">
						{{ app.options.creator }}
					</small>
				</div>
				<button
					:class="
						isFavorited ? 'text-yellow-500' : (
							'text-gray-300 dark:text-white/50 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-700 transition-colors duration-150'
						)
					"
					@click="useAuthStore().toggleFavoriteApp(app.appId)"
				>
					<IconComponent :name="isFavorited ? 'StarTinyFilled' : 'StarTiny'" />
				</button>
			</header>

			<nav class="flex items-center justify-between px-1">
				<div class="grow truncate pe-2">
					<a class="block w-full truncate text-[12px]">
						{{ app.options.group }}
					</a>
				</div>
				<footer class="flex items-center justify-end gap-0">
					<GButton
						type="text"
						size="small"
						class="size-6"
						@click="goTo(app, 'dashboard')"
					>
						<IconComponent
							class="size-5"
							name="Dashboard"
						/>
					</GButton>
					<GButton
						v-if="app.role === 'edit'"
						type="text"
						size="small"
						class="size-6"
						@click="$emit('edit', app)"
					>
						<IconComponent
							class="size-5"
							name="Edit"
						/>
					</GButton>
					<GButton
						v-if="app.role === 'edit'"
						type="text"
						size="small"
						class="size-6"
						@click="goTo(app, 'studio')"
					>
						<IconComponent
							name="Studio"
							class="rotate-[-90deg] size-5"
						/>
					</GButton>
				</footer>
			</nav>
		</div>
	</article>
</template>

<script setup lang="ts">
import { useAppStore, useAuthStore } from '@/stores'
import type { AppType } from '@gaio/shared/types'
import { cloneDeep, uniq } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type UserAppsType = {
	role: 'view' | 'edit'
} & AppType

defineEmits(['edit'])
const props = defineProps<{ app: UserAppsType; gradient?: boolean }>()

const router = useRouter()
const currentApp = ref<Partial<AppType>>({})
const user = useAuthStore().user

const isFavorited = computed(() => {
	return user?.options?.favorApps?.includes(props.app.appId)
})

const goTo = async (app: AppType, type: string) => {
	useAppStore().app = app
	await router.push(type).then(() => {
		updateRecentApps()
	})
}

const updateRecentApps = () => {
	user.options.recentApps.unshift(props.app.appId)

	if (user.options.recentApps.length > 4) {
		user.options.recentApps.pop()
	}

	user.options.recentApps = uniq(user.options.recentApps)

	console.log(user.options)

	useAuthStore().updateUserOptions(user.options)
}

onMounted(() => {
	currentApp.value = cloneDeep(props.app)
})
</script>
