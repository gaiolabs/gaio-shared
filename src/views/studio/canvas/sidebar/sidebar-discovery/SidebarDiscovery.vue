<template>
	<div class="sidebar-discovery flex h-[100%] flex-col items-stretch pt-3">
		<div class="flex w-full items-stretch justify-between px-4">
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
		</div>
		<div>
			<div class="sidebar-search mb-2 px-4 pt-1">
				<NInput
					v-model:value="searchTerm"
					size="small"
					:placeholder="$t('search')"
				/>
			</div>
			<div
				v-for="item of $filterBy(discoveryList, 'label', searchTerm)"
				:key="item.metaId"
				class="mx-4 border-b py-2"
				@click="choose(item)"
			>
				<g-icon :name="item.type" />
				{{ item.label }}
			</div>
		</div>
		<task-meta
			v-if="showPanel"
			@save="getDiscoveryList"
			@close="showPanel = false"
		/>
	</div>
</template>
<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import TaskMeta from '@/views/studio/canvas/task-meta/TaskMeta.vue'
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
