<template>
	<settings-view>
		<template #title>
			<div class="flex items-center gap-2">
				<g-icon
					name="appShare"
					:height="22"
				/>
				{{ $t('apps') }}
			</div>
		</template>
		<div class="source-manager">
			<template v-if="loading">
				<NSpace vertical>
					<NSkeleton
						:height="30"
						class="rounded"
					/>
					<NSkeleton
						:height="100"
						class="rounded"
					/>
				</NSpace>
			</template>
			<template v-else>
				<div class="app-share w-full pb-2">
					<div class="g-bg-1 mb-3 flex items-center gap-2 rounded p-2 shadow">
						<div class="flex grow text-nowrap">
							{{ $t('grantFrom') }}
						</div>
						<NSelect
							v-model:value="appId"
							filterable
							value-field="appId"
							label-field="appName"
							:options="apps"
							@update:value="selectApp"
						/>

						<div>
							<NButton
								type="primary"
								@click="save()"
							>
								{{ $t('apply') }}
							</NButton>
						</div>
					</div>
					<div class="g-bg-1 mb-3 flex items-center rounded shadow">
						<NTransfer
							ref="transfer"
							v-model:value="currentApp.sees"
							source-filterable
							value-field="appId"
							label-field="appName"
							:options="apps"
						/>
					</div>
				</div>
			</template>
		</div>
	</settings-view>
</template>

<script setup lang="ts">
type PassType = Partial<{
	sees: string[]
}> &
	AppType
import useApi from '@/composables/useApi'
import SettingsView from '@/views/settings/SettingsView.vue'
import type { AppType } from '@gaio/shared/types'
import { difference } from 'lodash-es'
import { NTransfer } from 'naive-ui'
import { onMounted, ref } from 'vue'

const apps = ref([])
const currentApp = ref<PassType>({})
const loading = ref(true)
const appId = ref()

const selectApp = () => {
	currentApp.value = apps.value.find((o) => o.appId === appId.value)
}

const save = () => {
	useApi().post('api/settings/app/setup-share', {
		body: {
			appId: currentApp.value.appId,
			repoId: currentApp.value.repoId,
			sees: currentApp.value.sees,
			revokeList: difference(
				apps.value.map((a) => a.appId),
				currentApp.value.sees
			)
		}
	})
}

const listAppShared = () => {
	loading.value = true
	useApi()
		.get('api/settings/app/shared-list')
		.then((res) => {
			currentApp.value = res[0]
			appId.value = currentApp.value.appId
			apps.value = res.map((o: PassType) => {
				return {
					...o,
					value: o.appId,
					label: o.appName
				}
			})
			loading.value = false
		})
}

onMounted(() => listAppShared())
</script>
