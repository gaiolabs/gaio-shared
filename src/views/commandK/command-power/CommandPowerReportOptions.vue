<template>
	<div class="command-power-report-options">
		<!--REPORT TYPES-->
		<div class="flex-between flex items-center gap-2 border-b border-paper-400 p-1 py-2 dark:border-carbon-400">
			<template v-if="showTab === 'main'">
				<div class="flex-vertical-center gap-3">
					<div
						v-for="report of reportTypes"
						:key="report.label"
					>
						<n-button
							size="tiny"
							text
							@click="emit('change', report)"
						>
							<template #icon>
								<g-icon :name="report.icon" />
							</template>
						</n-button>
					</div>
				</div>
				<div class="flex-vertical-center gap-3">
					<div
						v-for="action of actions"
						:key="action.label"
						class="flex-vertical-center gap-2"
					>
						<n-button
							size="tiny"
							text
							@click="doAction(action.action)"
						>
							<template #icon>
								<g-icon :name="action.icon" />
							</template>
						</n-button>
					</div>
				</div>
			</template>
			<template v-if="showTab === 'saveView'">
				<div class="flex w-full gap-2">
					<div class="flex-grow">
						<n-input-group size="tiny">
							<n-input-group-label size="tiny">{{ $t('label') }}</n-input-group-label>
							<n-input
								v-model:value="usePowerStore().selectedView.label"
								size="tiny"
								:placeholder="$t('typeHere')"
								:readonly="loading"
							/>
						</n-input-group>
					</div>
					<div>
						<n-button
							size="tiny"
							type="primary"
							:disabled="!usePowerStore().selectedView.label"
							:loading="loading"
							@click="saveView"
						>
							{{ $t('save') }}
						</n-button>
					</div>
				</div>
			</template>
		</div>
		<!--ACTIONS-->
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import { usePowerStore } from '@/stores'
import type { ReportNodeType, ReportTaskSettingsType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['change'])
const props = defineProps<{ report: ReportNodeType }>()
const showTab = ref('main')
const title = ref('')
const loading = ref(false)

const doAction = (type: string) => {
	if (type === 'saveView') {
		title.value = ''
		showTab.value = 'saveView'
	}
}

const saveView = async () => {
	loading.value = true
	usePowerStore().selectedView.task = props.report
	usePowerStore().selectedView.label = title.value
	usePowerStore().selectedView.tags = usePowerStore().tags
	let saveUrl = 'api/commander/create-view'

	if (usePowerStore().selectedView.metaViewId) {
		saveUrl = 'api/commander/save-view'
	} else {
		usePowerStore().selectedView.metaViewId = getId()
	}

	await useApi().post(saveUrl, {
		body: {
			metaViewData: usePowerStore().selectedView
		}
	})

	showTab.value = 'main'
	title.value = ''
	loading.value = false
}

const actions = [
	{
		label: t('share'),
		icon: 'share',
		action: 'share'
	},
	{
		label: t('download'),
		icon: 'download',
		action: 'download'
	},
	{
		label: t('save'),
		icon: 'save',
		action: 'saveView'
	}
]

const reportTypes = [
	{
		label: t('table'),
		type: 'reportPreview',
		reportType: 'table',
		icon: 'table'
	},
	{
		label: t('bar'),
		type: 'reportPreview',
		reportType: 'bar',
		icon: 'bar',
		settings: {
			columnBar: false,
			xGrid: true,
			yGrid: false
		} as ReportTaskSettingsType
	},
	{
		label: t('column'),
		type: 'reportPreview',
		reportType: 'bar',
		icon: 'column',
		settings: {
			columnBar: true,
			xGrid: false,
			yGrid: true
		}
	},
	{
		label: t('line'),
		type: 'reportPreview',
		reportType: 'line',
		icon: 'line'
	},
	{
		label: t('area'),
		type: 'reportPreview',
		reportType: 'area',
		icon: 'area'
	},
	{
		label: t('pie'),
		type: 'reportPreview',
		reportType: 'pie',
		icon: 'pie',
		settings: {
			pieDonut: false
		}
	},
	{
		label: t('heatmap'),
		type: 'reportPreview',
		reportType: 'heatmap',
		icon: 'heatmap'
	},

	{
		label: t('treemap'),
		type: 'reportPreview',
		reportType: 'treemap',
		icon: 'treemap'
	}
]
</script>
