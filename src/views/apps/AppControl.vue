<template>
	<g-dialog @close="$emit('close')">
		<template #title>
			<div class="flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<div v-if="localApp?.options?.icon">
						<g-app-icon
							:name="localApp.options.icon"
							:size="18"
							:color="localApp.options.color"
						/>
					</div>
					<div v-if="localApp.appId">
						<span v-if="localApp.appName">
							{{ localApp.appName }}
						</span>
						<span v-else>{{ $t('app') }}</span>
					</div>
					<div v-else>
						{{ $t('newApp') }}
					</div>
				</div>
				<div v-if="localApp.appId">
					<g-id :id="localApp.appId" />
				</div>
			</div>
		</template>
		<template #tabs>
			<n-tabs
				pane-class="bg-elevation-1"
				size="small"
				type="line"
				:default-value="currentTab"
			>
				<n-tab-pane
					name="general"
					:tab="$t('general')"
					display-directive="show:lazy"
				>
					<app-control-general
						v-if="localApp.options"
						:local-app="localApp"
					/>
				</n-tab-pane>
				<n-tab-pane
					v-if="localApp.appId"
					name="process"
					:tab="$t('process')"
					display-directive="show:lazy"
				>
					<app-control-flow :local-app="localApp" />
				</n-tab-pane>
				<n-tab-pane
					v-if="localApp.appId"
					name="portal"
					:tab="$t('portal')"
					display-directive="show:lazy"
				></n-tab-pane>
				<n-tab-pane
					v-if="localApp.appId"
					name="apiKeys"
					:tab="$t('apiKeys')"
					display-directive="show:lazy"
				></n-tab-pane>
			</n-tabs>
			<div class="border-t px-2 py-2">
				<div class="flex justify-end gap-2">
					<NButton
						type="primary"
						@click="save()"
					>
						{{ $t('save') }}
					</NButton>
				</div>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import AppControlFlow from '@/views/apps/AppControlFlow.vue'
import AppControlGeneral from '@/views/apps/AppControlGeneral.vue'
import { type AppType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const currentTab = ref('general')
const loading = ref(false)
const props = defineProps({
	app: {
		type: Object as () => AppType,
		default: null
	}
})

const localApp = ref<AppType>({
	appDescription: '',
	appId: '',
	appName: '',
	appToken: '',
	forms: [],
	options: {
		color: '#444',
		icon: 'box-seam',
		creator: `User Creator`,
		group: '',
		folderFlow: [],
		studioFlowStart: ''
	},
	params: [],
	repoId: ''
})

const save = () => {
	loading.value = true
	useApi().post('api/app/save', {
		body: {
			app: localApp.value
		}
	})

	emit('save', localApp.value)
	emit('close')
}

onMounted(() => {
	if (props.app) {
		localApp.value = cloneDeep(props.app)
	}
})
</script>
