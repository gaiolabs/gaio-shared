<template>
	<div class="flex bg-elevation-1">
		<div class="ms-3 flex space-x-4 bg-elevation-1">
			<div
				v-for="tab of mainTabs.filter((tabItem) => showWhenRoute(tabItem.onlyIf))"
				:key="tab.id"
				class="border-b-2 p-2"
				:class="tab.id === useCommandKStore().tab ? 'border-[var(--elevation-primary)]' : 'border-transparent'"
				@click="useCommandKStore().tab = tab.id"
			>
				<n-button
					text
					class="border-b-2 border-indigo-600 px-4 py-2 text-indigo-600"
				>
					{{ tab.name }}
				</n-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCommandKStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const showWhenRoute = (onlyIf: string) => {
	if (onlyIf === 'all') {
		return true
	} else if (router.currentRoute.value.name === onlyIf) {
		return true
	}
	return
}

const mainTabs = [
	{
		id: 'all',
		name: t('all'),
		onlyIf: 'all'
	},
	{
		id: 'power',
		name: t('powerSearch'),
		onlyIf: 'all'
	},
	{
		id: 'insights',
		name: t('insights'),
		onlyIf: 'all'
	},
	{
		id: 'table',
		name: t('table') + 's',
		onlyIf: 'studio'
	},
	{
		id: 'flow',
		name: t('flow'),
		onlyIf: 'studio'
	}
]
</script>
