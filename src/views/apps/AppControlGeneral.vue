<template>
	<div
		v-if="localApp && localApp.options"
		class="app-control-general"
	>
		<div
			v-if="localApp.options"
			class="app-control bg-elevation-1 p-3 px-4"
		>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<div>{{ $t('name') }}</div>
					<NInput v-model:value="localApp.appName" />
				</div>
				<div>
					<div>{{ $t('description') }}</div>
					<NInput v-model:value="localApp.appDescription" />
				</div>
			</div>
			<div class="mt-2">
				<div>{{ $t('repository') }}</div>
				<NSelect
					v-model:value="localApp.repoId"
					:disabled="!!localApp.appId"
					:options="repoList"
				/>
			</div>
			<div class="mt-2 flex gap-2">
				<div class="grow">
					<div>{{ $t('creator') }}</div>
					<NInput v-model:value="localApp.options.creator" />
				</div>
				<div class="grow">
					<div>{{ $t('group') }}</div>
					<NInput v-model:value="localApp.options.group" />
				</div>
				<div class="w-[70px]">
					<div>{{ $t('color') }}</div>
					<NColorPicker
						v-model:value="localApp.options.color"
						:render-label="() => ''"
						:modes="['hex']"
					/>
				</div>
				<div class="w-[55px]">
					<div>{{ $t('icon') }}</div>
					<NButton
						type="primary"
						@click="showIconControl = true"
					>
						<template #icon>
							<g-app-icon :name="localApp.options.icon" />
						</template>
					</NButton>
				</div>
			</div>
			<div class="mt-2">
				{{ $t('dashboardLink') }}
				<NList
					v-if="localApp.appToken"
					size="small"
					bordered
				>
					<NListItem>
						{{ appUrl }}
					</NListItem>
				</NList>
			</div>
		</div>

		<g-icon-finder
			v-if="showIconControl"
			@close="showIconControl = false"
			@choose="localApp.options.icon = $event"
		/>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { AppType } from '@gaio/shared/types'
import { NColorPicker } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'

const props = withDefaults(
	defineProps<{
		localApp: AppType
	}>(),
	{
		localApp: null
	}
)

const repoList = ref<{ label: string; value: string }[]>([])
const showIconControl = ref(false)

const appUrl = computed(() => {
	return `${window.location.origin}/app/${props.localApp.appToken}`
})

const loadRepository = async () => {
	repoList.value = await useApi()
		.get('api/repo/list')
		.then((res) => {
			return res.map((repo) => {
				return {
					label: repo.repoName,
					value: repo.repoId
				}
			})
		})
}

onMounted(() => {
	loadRepository()
})
</script>
