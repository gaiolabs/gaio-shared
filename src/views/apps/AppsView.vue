<template>
	<div class="apps flex h-full justify-center">
		<div class="apps-wrapper w-full max-w-[1440px] overflow-auto p-4 pb-[70px]">
			<div class="flex items-center justify-between">
				<h3 class="inline-flex gap-2 items-center text-lg font-bold">
					<IconComponent
						class="h-6 w-6"
						name="Apps"
					/>
					<span>
						{{ $t('dataApps') }}
					</span>
				</h3>
				<div class="flex max-w-[320px] grow gap-2">
					<NInput
						v-model:value="searchTerm"
						clearable
						class="w-full"
						size="small"
						:placeholder="$t('filterApps')"
					/>
					<NButton
						secondary
						size="small"
						type="default"
					>
						{{ $t('filter') }}
					</NButton>
				</div>
			</div>
			<!--RECENT AND FAVORITES-->
			<section
				id="recent-and-favorites"
				class="my-3 flex"
			>
				<div class="g-bg-1 flex gap-1 rounded bg-paper-100 p-1 shadow">
					<NButton
						:type="currentTab === 'recent' ? 'primary' : 'default'"
						size="small"
						:quaternary="currentTab === 'favorites'"
						@click="currentTab = 'recent'"
					>
						{{ $t('recent') }}
					</NButton>
					<NButton
						:type="currentTab === 'favorites' ? 'primary' : 'default'"
						size="small"
						:quaternary="currentTab === 'recent'"
						@click="currentTab = 'favorites'"
					>
						{{ $t('favorites') }}
					</NButton>
				</div>
			</section>
			<section
				id="apps-filtered-by-user"
				class="my-3"
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
					<apps-card
						v-for="app of filteredApps"
						:key="app.appId"
						:shadow="!isDark"
						gradient
						:app="app"
					/>
				</div>
				<div v-else-if="currentTab === 'recent'">
					<g-alert :title="$t('noRecentApps')" />
				</div>
				<div v-else-if="currentTab === 'favorites'">
					<g-alert :title="$t('noFavoriteApps')" />
				</div>
			</section>

			<!--ALL APPS-->
			<section
				id="all-apps"
				class="mb-2 mt-2 flex items-center justify-between gap-1"
			>
				<h3 class="inline-flex gap-2 items-center text-lg font-bold">
					<IconComponent
						class="h-6 w-6"
						name="AllApps"
					/>
					<span>
						{{ $t('allApps') }}
					</span>
				</h3>
				<div class="my-3 flex">
					<div
						class="core-shadow flex gap-1 rounded-[8px] bg-paper-100 p-1 dark:border dark:border-gray-800 dark:bg-carbon-200"
					>
						<NButton
							:type="listType === 'grid' ? 'primary' : 'default'"
							size="small"
							:quaternary="listType === 'list'"
							@click="changeUserViewType('grid')"
						>
							<template #icon>
								<IconComponent name="Grid" />
							</template>
						</NButton>
						<NButton
							:quaternary="listType === 'grid'"
							:type="listType === 'list' ? 'primary' : 'default'"
							size="small"
							@click="changeUserViewType('list')"
						>
							<template #icon>
								<IconComponent name="List" />
							</template>
						</NButton>
					</div>
				</div>
			</section>
			<!-- GRID CARD -->
			<template v-if="listType === 'grid'">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<template v-if="loading">
						<div
							v-for="n in 8"
							:key="n"
							class="core-gradient h-[108px] animate-pulse rounded-[8px] border bg-gray-200 dark:border-gray-800 dark:bg-gray-700"
						></div>
					</template>
					<template v-else>
						<apps-card
							v-for="app of listLocalApps"
							:key="app.appId"
							gradient
							:shadow="!isDark"
							:app="app"
							@edit="editApp"
						/>
					</template>
				</div>
			</template>
			<!-- LIST CARD -->
			<template v-else>
				<ul class="flex w-full flex-col">
					<li
						v-for="app of listLocalApps"
						:key="app.appId"
						class="g-bg-1 group g-border-500 -mt-px gap-3 inline-flex grow items-center border-b border-e-0 border-s-0 px-4 py-3 font-medium shadow first:mt-0 first:rounded-t-lg first:border-0 last:rounded-b-lg last:border-b-0"
					>
						<header class="flex gap-2 items-center flex-1">
							<div class="relative w-8 h-8 flex items-center justify-center">
								<IconComponent
									class="z-10"
									:fill="app.options.color"
									:secondaryfill="app.options.color"
									:name="
										app.options.icon === 'icon-shield-alert' ? 'ShieldAlert'
										: app.options.icon === 'icon-square-dashed-bottom' ? 'SquarePointer'
										: app.options.icon === 'icon-hop-off' ? 'Seedling'
										: app.options.icon === 'icon-mountain' ? 'ImageMountain'
										: app.options.icon === 'box-seam' ? 'SquareDashedContent'
										: app.options.icon === 'icon-hard-drive' ? 'HardDrive'
										: app.options.icon === 'icon-martini' ? 'WineGlass'
										: app.options.icon
									"
								/>
								<div
									class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 z-0 rounded"
									:style="{
										backgroundColor: app.options.color,
									}"
								></div>
							</div>
							<h6 class="font-medium">
								{{ app.appName }}
							</h6>
						</header>

						<footer
							class="flex opacity-25 group-hover:opacity-100 transition-opacity duration-300 min-w-[80px] items-center gap-4"
						>
							<NButton
								text
								size="small"
							>
								<template #icon>
									<IconComponent name="Dashboard" />
								</template>
							</NButton>
							<NButton
								v-if="app.role === 'edit'"
								text
								size="small"
								@click="editApp(app)"
							>
								<template #icon>
									<IconComponent name="Pencil" />
								</template>
							</NButton>
							<NButton
								v-if="app.role === 'edit'"
								text
								size="small"
							>
								<template #icon>
									<IconComponent
										name="Studio"
										class="rotate-[-90deg]"
									/>
								</template>
							</NButton>
						</footer>
					</li>
				</ul>
			</template>
			<!--PAGINATE-->
			<div class="mt-5 flex w-full justify-center">
				<NPagination
					v-if="appList.length > 12"
					v-model:page="currentPage"
					:page-count="Math.round(appList.length / 12)"
				/>
			</div>
			<!--EDIT APP-->
			<AppControl
				v-if="show"
				:app="currentApp"
				@save="manuallyUpdateApp"
				@close="show = false"
			/>
		</div>
		<home-nav />
	</div>
</template>

<script setup lang="ts">

import useApps from '@/composables/useApps'
import useHelper from '@/composables/useHelper'
import { useAuthStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import AppsCard from '@/views/apps/AppsCard.vue'
import HomeNav from '@/views/home/HomeNav.vue'
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

const editApp = (app) => {
	currentApp.value = app
	show.value = true
}

const listType = ref(`${useAuthStore().user.options.appViewType || 'grid'}`)

onMounted(async () => {
	await listApps('all')
})
</script>
