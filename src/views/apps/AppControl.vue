<template>
	<GDialog @close="$emit('close')">
		<template #title>
			<div class="flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<div v-if="localApp?.options?.icon">
						<GAppIcon
							:name="localApp.options.icon"
							class="size-10 !font-normal"
							:size="20"
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
			<GTabs v-model="currentTab">
				<GTab
					name="general"
					:label="$t('general')"
					display-directive="show:lazy"
				>
					<AppControlGeneral
						v-if="localApp.options"
						:local-app="localApp"
					/>
				</GTab>
				<GTab
					name="process"
					:label="$t('process')"
					display-directive="show:lazy"
				>
					<AppControlFlow
						v-if="localApp.appId"
						:local-app="localApp"
					/>
				</GTab>
				<GTab
					name="portal"
					:label="$t('portal')"
					display-directive="show:lazy"
				></GTab>
				<GTab
					name="apiKeys"
					:label="$t('apiKeys')"
					display-directive="show:lazy"
				></GTab>

				<template #footer>
					<div class="flex justify-end gap-2">
						<GButton
							type="primary"
							@click="save()"
						>
							{{ $t('save') }}
						</GButton>
					</div>
				</template>
			</GTabs>
		</template>
	</GDialog>
</template>

<script setup lang="ts">
import GAppIcon from '@/components/GAppIcon.vue'
import GButton from '@/components/inputs/GButton.vue'
import GTab from '@/components/inputs/GTab.vue'
import GTabs from '@/components/inputs/GTabs.vue'
import useApi from '@/composables/useApi'
import AppControlFlow from '@/views/apps/AppControlFlow.vue'
import AppControlGeneral from '@/views/apps/AppControlGeneral.vue'
import { type AppType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { NTabPane } from 'naive-ui'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const currentTab = ref('general')
const loading = ref(false)
const props = defineProps({
	app: {
		type: Object as () => AppType,
		default: null,
	},
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
		studioFlowStart: '',
	},
	params: [],
	repoId: '',
})

const save = () => {
	loading.value = true
	useApi().post('api/app/save', {
		body: {
			app: localApp.value,
		},
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
