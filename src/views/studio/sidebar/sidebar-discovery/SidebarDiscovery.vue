<template>
	<aside
		id="sidebar-discovery"
		class="flex h-full flex-col items-stretch p-3 gap-3"
	>
		<header class="flex flex-col gap-3">
			<nav class="flex w-full items-stretch justify-between">
				<h2 class="text-lg font-bold inline-flex gap-1 items-center">
					<IconComponent name="Discovery" />
					<span>
						{{ $t('discovery') }}
					</span>
				</h2>
				<div>
					<NDropdown
						trigger="hover"
						:options="options"
						@select="handleDropdownSelect"
					>
						<NButton
							text
							size="tiny"
						>
							<template #icon>
								<IconComponent name="AddItem" />
							</template>
						</NButton>
					</NDropdown>
				</div>
			</nav>
			<div id="sidebar-discovery-search">
				<NInput
					v-model:value="searchTerm"
					size="small"
					:placeholder="$t('search')"
				/>
			</div>
		</header>
		<GCard class="flex grow flex-col overflow-hidden rounded-2xl p-2">
			<div
				v-for="item of $filterBy(discoveryList, 'label', searchTerm)"
				:key="item.metaId"
				class="mx-4 border-b py-2"
				@click="choose(item)"
			>
				<g-icon :name="item.type" />
				{{ item.label }}
			</div>
		</GCard>
		<task-meta
			v-if="showPanel"
			@save="getDiscoveryList"
			@close="showPanel = false"
		/>
	</aside>
</template>
<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import TaskMeta from '@/views/studio/tasks/task-meta/TaskMeta.vue'
import type { MetaType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineEmits(['choose'])

const { t } = useI18n()

const discoveryList = ref([])
const searchTerm = ref('')
const showPanel = ref(false)
const options = [
	{ label: t('powerSearch'), key: 'powerSearch' },
	{ label: t('insights'), key: 'insights' },
]

const choose = (metaData: MetaType) => {
	useAppStore().task = metaData
	showPanel.value = true
}

const handleDropdownSelect = (ev: string) => {
	if (ev === 'insights') {
		useAppStore().task = {
			type: 'insights',
			label: '',
			metaId: '',
			status: 'active',
			repoId: useAppStore().app.repoId,
			appId: useAppStore().app.appId,
			fields: [],
			options: {
				numberFormat: {
					formatType: 'decimal',
					formatDecimalSize: 2,
					separators: 'commaDot',
					formatPrefix: '',
					formatSuffix: '',
				},
				percentFormat: {
					formatType: 'decimal',
					formatDecimalSize: 2,
					separators: 'commaDot',
					formatPrefix: '',
					formatSuffix: '',
				},
				insights: {
					dimension: [],
					measure: [],
					date: [],
					list: [],
					type: 'field',
				},
				inverted: false,
				schedule: false,
				cron: '',
				growthPercentage: 0.5,
				period: 'monthly',
			},
		}
	} else {
		useAppStore().task = {
			type: 'power',
			label: '',
			metaId: '',
			status: 'active',
			appId: useAppStore().app.appId,
			repoId: useAppStore().app.repoId,
			fields: [],
			options: {
				userFilter: '',
			},
		}
	}
	showPanel.value = true
}

const getDiscoveryList = async () => {
	showPanel.value = false
	discoveryList.value = await useApi().post('api/discovery/list', {
		body: {
			appId: useAppStore().app.appId,
		},
	})
}

onMounted(() => getDiscoveryList())
</script>
