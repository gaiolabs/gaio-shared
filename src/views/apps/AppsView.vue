<template>
	<div class="apps flex h-full justify-center">
		<div class="apps-wrapper w-full max-w-[1440px] overflow-auto p-4 pb-[70px]">
			<div class="flex items-center justify-between">
				<div class="flex grow flex-row items-center gap-1 truncate text-2xl font-bold">
					<g-icon name="apps" />
					{{ $t('dataApps') }}
				</div>
				<div class="flex max-w-[320px] grow gap-2">
					<n-input
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
			<div class="my-3 flex">
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
			</div>
			<div class="apps-filtered-by-user my-3">
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
			</div>

			<!--ALL APPS-->
			<div class="mb-2 mt-2 flex items-center justify-between gap-1 text-lg font-bold">
				<div>
					<g-icon name="allApps" />
					{{ $t('allApps') }}
				</div>
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
								<g-icon name="grid" />
							</template>
						</NButton>
						<NButton
							:quaternary="listType === 'grid'"
							:type="listType === 'list' ? 'primary' : 'default'"
							size="small"
							@click="changeUserViewType('list')"
						>
							<template #icon>
								<g-icon name="list" />
							</template>
						</NButton>
					</div>
				</div>
			</div>
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
						class="g-bg-1 g-border-500 -mt-px inline-flex grow items-center border-b border-e-0 border-s-0 px-4 py-3 font-medium shadow first:mt-0 first:rounded-t-lg first:border-0 last:rounded-b-lg last:border-b-0"
					>
						<div class="flex min-w-[80px] items-center gap-4">
							<NButton
								text
								size="tiny"
							>
								<template #icon>
									<g-icon name="dashboard" />
								</template>
							</NButton>
							<NButton
								v-if="app.role === 'edit'"
								text
								size="tiny"
								@click="editApp(app)"
							>
								<template #icon>
									<g-icon name="pencil" />
								</template>
							</NButton>
							<NButton
								v-if="app.role === 'edit'"
								text
								size="tiny"
							>
								<template #icon>
									<g-icon name="workflow" />
								</template>
							</NButton>
						</div>
						<NDivider vertical />
						<div class="ms-3 flex gap-2">
							<g-app-icon
								:name="app.options.icon"
								:color="app.options.color"
							/>
							{{ app.appName }}
						</div>
					</li>
				</ul>
			</template>
			<!--PAGINATE-->
			<div class="mt-5 flex w-full justify-center">
				<n-pagination
					v-if="appList.length > 12"
					v-model:page="currentPage"
					:page-count="Math.round(appList.length / 12)"
				/>
			</div>
			<!--EDIT APP-->
			<app-control
				v-if="show"
				:app="currentApp as AppType"
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
import MainScroll from '@/layouts/main-scroll.vue'
import { useAuthStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import AppsCard from '@/views/apps/AppsCard.vue'
import HomeNav from '@/views/home/HomeNav.vue'
import type { AppType } from '@gaio/shared/types'
import { useDark } from '@vueuse/core'
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
		appViewType: type
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
