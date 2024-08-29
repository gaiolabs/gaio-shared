<template>
	<div class="flex items-center space-x-4 border-b bg-elevation-1 px-2">
		<div
			v-for="item of tabs"
			:key="item.id"
			class="flex min-w-[78px] items-center justify-center border-b-2 py-2 text-center"
			:class="item.id === usePowerStore().currentTab ? 'border-[var(--elevation-primary)]' : 'border-transparent'"
			@click="usePowerStore().currentTab = item.id"
		>
			<n-button
				size="small"
				text
			>
				<span class="flex items-center gap-1">
					<g-icon
						v-if="item.icon"
						:name="item.icon"
					/>
					{{ item.name }}
				</span>
			</n-button>
		</div>
	</div>
	<ul class="command-power-result">
		<li
			v-for="(result, index) in usePowerStore().filteredList"
			:key="index"
			class="border-b px-2 py-2"
			:class="{ active: usePowerStore().currentIndex === index }"
		>
			<div class="flex items-center gap-1 px-1">
				<div>
					<g-icon name="star" />
				</div>
				<n-divider vertical />
				<div
					class="flex items-center gap-2"
					:class="{ 'text-primary': usePowerStore().currentIndex === index }"
				>
					<g-icon :name="result.icon" />
					{{ result.label }}
				</div>
			</div>
		</li>
	</ul>
</template>
<script setup lang="ts">
import { usePowerStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tabs = [
	{
		id: 'all',
		name: t('all'),
		icon: 'powerAll'
	},
	{
		id: 'story',
		name: t('story'),
		icon: 'powerStory'
	},
	{
		id: 'view',
		name: t('views'),
		icon: 'powerView'
	},
	{
		id: 'context',
		name: t('context'),
		icon: 'powerContext'
	}
]
</script>
