<template>
	<g-card class="local-card group g-bg-1 w-full cursor-pointer rounded-xl p-0">
		<div class="flex justify-between gap-2">
			<header class="flex items-start gap-2 w-full">
				<div class="relative w-10 h-10 flex items-center justify-center">
					<IconComponent
						class="z-10"
						:fill="app.options.color"
						:secondaryfill="app.options.color"
						:name="app.options.icon"
					/>
					<div
						class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 z-0 rounded"
						:style="{
							backgroundColor: app.options.color,
						}"
					></div>
				</div>
				<div class="flex flex-1 flex-col">
					<h6 class="flex flex-1 font-medium">{{ app.appName }}</h6>

					<small class="text-gray-500 text-xs">
						{{ app.options.creator }}
					</small>
				</div>
				<button
					:class="isFavorited ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-600 transition-colors duration-150'"
					@click="useAuthStore().toggleFavoriteApp(app.appId)"
				>
					<IconComponent :name="isFavorited ? 'StarTinyFilled' : 'StarTiny'" />
				</button>
			</header>
		</div>
		<div class="mt-5 flex items-center justify-between px-1">
			<div class="grow truncate pe-2">
				<a class="block w-full truncate text-[12px]">
					{{ app.options.group }}
				</a>
			</div>
			<footer
				class="flex opacity-25 group-hover:opacity-100 transition-opacity duration-300 items-center justify-end gap-2"
			>
				<NButton
					size="small"
					text
					@click="goTo(app, 'dashboard')"
				>
					<template #icon>
						<IconComponent name="Dashboard" />
					</template>
				</NButton>
				<NButton
					v-if="app.role === 'edit'"
					size="small"
					text
					@click="$emit('edit', app)"
				>
					<template #icon>
						<IconComponent name="Edit" />
					</template>
				</NButton>
				<NButton
					v-if="app.role === 'edit'"
					size="small"
					text
					@click="goTo(app, 'studio')"
				>
					<template #icon>
						<IconComponent
							name="Studio"
							class="rotate-[-90deg]"
						/>
					</template>
				</NButton>
			</footer>
		</div>
	</g-card>
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
