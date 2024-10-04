<template>
	<article
		id="apps-card"
		class="group w-full cursor-pointer rounded-xl g-base transition-all duration-[75ms] hover:shadow-md hover:bg-white hover:dark:bg-ochre-100/[1.5%]"
		@click="goTo('dashboard')"
	>
		<span
			class="absolute left-4 right-4 bottom-[-2px] h-[2px] dark:h-px bg-gradient-to-r from-sepia-500/0 via-sepia-400 to-sepia-500/0 dark:from-ochre-500/0 dark:via-ochre-400 dark:to-ochre-500/0 transition duration-150 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 z-[-1]"
		></span>
		<span
			class="overflow-hidden absolute inset-0 transition origin-bottom duration-150 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 z-[-1]"
		>
			<span
				class="absolute inset-x-4 -bottom-2 h-full bg-gradient-to-t dark:from-ochre-500/5 from-sepia-500/10 to-transparent blur rounded-t-full z-[-1]"
			></span>
		</span>
		<div
			class="flex gap-5 p-2"
			:class="mode === 'card' ? 'flex-col' : 'flex-row'"
		>
			<header
				class="flex gap-2 w-full"
				:class="mode === 'card' ? 'items-start' : 'items-center'"
			>
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
					class=""
					@click.stop="toggleFavorite"
				>
					<Transition
						enter-active-class="transition-transform duration-150"
						enter-from-class="scale-125"
						enter-to-class="scale-100"
						leave-active-class="transition-transform duration-150"
						leave-from-class="scale-100"
						leave-to-class="scale-125"
						mode="out-in"
					>
						<IconComponent
							v-if="isFavorited"
							class="text-sepia-400 dark:text-ochre-600 hover:text-gray-300 hover:dark:text-white/30 transition-colors duration-150"
							name="StarTinyFilled"
						/>
						<IconComponent
							v-else
							class="text-gray-300 dark:text-white/30 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-400 transition-colors duration-150"
							name="StarTiny"
						/>
					</Transition>
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
						@click.stop="goTo('dashboard')"
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
						@click.stop="emit('edit', app)"
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
						@click.stop="goTo('studio')"
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type UserAppsType = {
	role: 'view' | 'edit'
} & AppType

const { app, mode = 'card' } = defineProps({
	app: {
		type: Object as PropType<UserAppsType>,
		required: true,
	},
	mode: {
		type: String as PropType<'card' | 'list'>,
		default: 'card',
	},
})

const emit = defineEmits(['edit'])

// Stores and router
const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const { user } = authStore

const isFavorited = computed(() => user?.options?.favorApps?.includes(app.appId))

// const favoriteButtonClass = computed(() =>
// 	isFavorited.value ? 'text-yellow-500' : (
// 		'text-gray-300 dark:text-white/50 text-black/20 hover:dark:text-ochre-600 hover:text-sepia-700 transition-colors duration-150'
// 	),
// )

function toggleFavorite() {
	authStore.toggleFavoriteApp(app.appId)
}

async function goTo(routeName: string) {
	appStore.app = app
	await router.push({ name: routeName })
	updateRecentApps()
}

function updateRecentApps() {
	const recentApps = user.options.recentApps || []
	const appId = app.appId

	// Remove existing instance to avoid duplicates
	const existingIndex = recentApps.indexOf(appId)
	if (existingIndex !== -1) recentApps.splice(existingIndex, 1)

	recentApps.unshift(appId)

	// Keep only the last 4 apps
	if (recentApps.length > 4) recentApps.length = 4

	// Update user options through the store action
	authStore.updateUserOptions({ ...user.options, recentApps })
}
</script>
