<template>
	<div class="home-apps">
		<div class="flex items-center gap-4">
			<div
				class="flex flex-row items-center gap-1 text-xl font-bold"
				@click="collapse = !collapse"
			>
				<g-icon name="apps" />
				{{ $t('dataApps') }}
			</div>
			<div class="g-bg-1 g-border-400 flex gap-1 rounded p-1">
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
			<NButton
				size="small"
				type="primary"
				@click="$router.push('/apps')"
			>
				{{ $t('seeAll') }}
			</NButton>
		</div>
		<div
			v-show="collapse"
			class="home-apps-body animate-fade-in mt-3"
		>
			<NSpace>
				<g-card
					v-for="app of filteredApps"
					:key="app.appId"
					style="min-width: 300px"
					:shadow="!isDark"
					class="core-gradient local-card cursor-pointer rounded-xl p-0"
					content-style="padding: 10px"
				>
					<div class="flex items-center justify-between gap-2">
						<div class="base-three-bg flex h-[25px] w-[25px] items-center justify-center rounded-[8px]">
							<g-app-icon
								:name="app.options.icon"
								:size="20"
								:color="app.options.color"
							/>
						</div>
						<div class="grow text-left">
							<div class="w-full truncate">
								{{ app.appName }}
							</div>
							<div class="grow truncate text-left text-xs text-gray-500">
								{{ app.options.creator }}
							</div>
						</div>
						<n-dropdown
							trigger="hover"
							:options="options"
							@select="goTo(app, $event)"
						>
							<NButton text>
								<template #icon>
									<g-icon name="unfold" />
								</template>
							</NButton>
						</n-dropdown>
					</div>
				</g-card>
			</NSpace>
		</div>
		<!--EDIT APP-->
		<app-control
			v-if="showEditApp"
			:app="currentApp as AppType"
			@save="manuallyUpdateApp"
			@close="showEditApp = false"
		/>
	</div>
</template>

<script setup lang="ts">
import useApps from '@/composables/useApps'
import { useAppStore } from '@/stores'
import AppControl from '@/views/apps/AppControl.vue'
import type { AppType } from '@gaio/shared/types'
import { useDark } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const isDark = useDark()
const collapse = ref(true)

const currentApp = ref<Partial<AppType>>({})
const showEditApp = ref(false)

const { manuallyUpdateApp, filteredApps, currentTab, listApps } = useApps()
const { t } = useI18n()
const router = useRouter()

const goTo = (app: AppType, tab: string) => {
	useAppStore().app = app

	if (tab === 'dashboard') {
		router.push('/dashboard')
		return
	} else if (tab === 'studio') {
		router.push('/studio')
		return
	} else {
		currentApp.value = app
		showEditApp.value = true
	}
}

const options = [
	{
		label: t('dashboard'),
		value: 'dashboard',
		key: 'dashboard'
	},
	{
		label: t('edit'),
		value: 'edit',
		key: 'edit'
	},
	{
		label: t('studio'),
		value: 'studio',
		key: 'studio'
	}
]

onMounted(async () => {
	await listApps('userPin')
})
</script>
