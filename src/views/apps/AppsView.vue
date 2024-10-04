<template>
	<main
		id="apps-view"
		class="apps flex h-full justify-center"
	>
		<div
			id="apps-wrapper"
			class="w-full p-4 flex flex-col gap-4"
		>
			<GPageHeader
				:title="$t('dataApps')"
				icon="Apps"
			>
				<NInput
					v-model:value="searchTerm"
					clearable
					class="w-full !rounded-lg"
					size="small"
					:placeholder="$t('filterApps')"
				>
					<template #prefix>
						<IconComponent
							class="size-5 text-gray-400"
							name="Filter"
						/>
					</template>
				</NInput>
				<!-- <GButton
					type="primary"
					size="small"
					class=""
				>
					<template #icon>
						<IconComponent
							class="size-5"
							name="Filter"
						/>
					</template>
					<span>
						{{ $t('filter') }}
					</span>
				</GButton> -->
			</GPageHeader>

			<article class="p-2 pb-[88px] flex flex-col gap-8 flex-1 overflow-auto w-full">
				<!--RECENT AND FAVORITES-->
				<section
					id="recent-and-favorites"
					class="flex flex-col items-start gap-4 mx-auto max-w-[1440px] ultrawide:max-w-[1920px] w-full"
				>
					<nav class="g-wrapper flex p-2 rounded-2xl gap-2">
						<span class="sr-only">{{ $t('toggleCurrentTab') }}</span>
						<GButton
							:type="currentTab === 'recent' ? 'primary' : 'tertiary'"
							class="rounded-lg"
							@click="currentTab = 'recent'"
						>
							{{ $t('recent') }}
						</GButton>
						<GButton
							:type="currentTab === 'favorites' ? 'primary' : 'tertiary'"
							class="rounded-lg"
							@click="currentTab = 'favorites'"
						>
							{{ $t('favorites') }}
						</GButton>
					</nav>

					<div
						id="apps-filtered-by-user"
						class="w-full rounded-3xl g-wrapper p-4"
					>
						<template v-if="loading">
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div
									v-for="n in 4"
									:key="n"
									class="core-gradient h-[108px] animate-pulse rounded-[16px] border bg-gray-200 p-0 dark:border-gray-800 dark:bg-gray-700"
								/>
							</div>
						</template>
						<div
							v-else-if="filteredApps.length"
							class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
						>
							<AppsCard
								v-for="app of filteredApps"
								:key="app.appId"
								mode="list"
								:app="app"
							/>
						</div>
						<div v-else-if="currentTab === 'recent'">
							<GAlert :title="$t('noRecentApps')" />
						</div>
						<div v-else-if="currentTab === 'favorites'">
							<GAlert :title="$t('noFavoriteApps')" />
						</div>
					</div>
				</section>

				<!--ALL APPS-->
				<section
					id="all-apps"
					class="flex flex-col gap-4 mx-auto max-w-[1440px] ultrawide:max-w-[1920px] w-full"
				>
					<header class="flex items-end justify-between">
						<h3 class="inline-flex gap-1 items-center text-xl">
							<IconComponent
								class="h-6 w-6 text-gray-400"
								name="AllApps"
							/>
							<span>
								{{ $t('allApps') }}
							</span>
						</h3>
						<nav class="g-wrapper flex p-2 rounded-2xl gap-2">
							<span class="sr-only">{{ $t('toggleViewMode') }}</span>
							<GButton
								:type="listType === 'grid' ? 'primary' : 'tertiary'"
								class="rounded-lg size-8"
								@click.prevent="changeUserViewType('grid')"
							>
								<IconComponent name="Grid" />
							</GButton>
							<GButton
								:type="listType === 'list' ? 'primary' : 'tertiary'"
								class="rounded-lg size-8"
								@click.prevent="changeUserViewType('list')"
							>
								<IconComponent name="List" />
							</GButton>
						</nav>
					</header>

					<!-- GRID CARD -->
					<Transition
						enter-active-class="transition-all duration-500"
						enter-from-class="opacity-0 -translate-y-2"
						enter-to-class="opacity-100"
						leave-active-class="transition-all duration-500"
						leave-from-class="opacity-100 "
						leave-to-class="opacity-0 -translate-y-2"
						mode="out-in"
					>
						<template v-if="listType === 'grid'">
							<div
								class="grid g-wrapper grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ultrawide:grid-cols-6 p-4 rounded-3xl gap-4 lg:grid-cols-4"
							>
								<template v-if="loading">
									<div
										v-for="n in 8"
										:key="n"
										class="core-gradient h-[108px] animate-pulse rounded-[8px] border bg-gray-200 dark:border-gray-800 dark:bg-gray-700"
									></div>
								</template>
								<template v-else>
									<AppsCard
										v-for="app of listLocalApps"
										:key="app.appId"
										:app="app"
										@edit="editApp"
									/>
								</template>
							</div>
						</template>
						<template v-else>
							<div class="grid g-wrapper grid-cols-1 p-4 rounded-3xl gap-4">
								<template v-if="loading">
									<div
										v-for="n in 8"
										:key="n"
										class="core-gradient h-[108px] animate-pulse rounded-[8px] border bg-gray-200 dark:border-gray-800 dark:bg-gray-700"
									></div>
								</template>
								<template v-else>
									<AppsCard
										v-for="app of listLocalApps"
										:key="app.appId"
										mode="list"
										:app="app"
										@edit="editApp"
									/>
								</template>
							</div>
						</template>
					</Transition>

					<!--PAGINATE-->
					<nav class="flex w-full justify-center">
						<NPagination
							v-if="appList.length > 12"
							v-model:page="currentPage"
							class="g-wrapper p-2 rounded-2xl"
							:page-count="Math.round(appList.length / 12)"
						/>
					</nav>
				</section>
			</article>

			<!--EDIT APP-->
			<AppControl
				v-if="show"
				:app="currentApp"
				@save="manuallyUpdateApp"
				@close="show = false"
			/>
		</div>
		<home-nav />
	</main>
</template>

<script setup lang="ts">
import GPageHeader from '@/components/GPageHeader.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import GButton from '@/components/inputs/GButton.vue'
import HomeNav from '@/components/main-nav/GMainNav.vue'
import useApps from '@/composables/useApps'
import useHelper from '@/composables/useHelper'
import { useAuthStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import AppsCard from '@/views/apps/AppsCard.vue'
import type { AppType } from '@gaio/shared/types'
import { useDark } from '@vueuse/core'
import { NPagination } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

const { filteredApps, currentTab, appList, manuallyUpdateApp, listApps, loading, searchTerm } = useApps()
const { getPaginatedItems } = useHelper()
const isDark = useDark()
const currentPage = ref(1)

const listLocalApps = computed(() => {
	return getPaginatedItems(appList.value, currentPage.value, 12).data
})

const currentApp = ref<Partial<AppType>>({})
const show = ref(false)

const changeUserViewType = (type: string) => {
	listType.value = type
	useAuthStore().updateUserOptions({
		appViewType: type,
	})
}

const editApp = (app: AppType): void => {
	currentApp.value = app
	show.value = true
}

const listType = ref(`${useAuthStore().user?.options?.appViewType || 'grid'}`)
const user = computed(() => useAuthStore().user)
onMounted(async () => {
	await listApps('all')
})
</script>
