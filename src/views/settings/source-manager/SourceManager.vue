<template>
	<div class="source-manager">
		<settings-view>
			<template #title>
				<div class="flex items-center gap-2">
					<g-icon
						name="database"
						:height="22"
					/>
					{{ $t('sources') }}
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
							:height="90"
							class="rounded"
						/>
					</NSpace>
				</template>

				<template v-else>
					<div class="source-manager">
						<div class="g-bg-1 mb-3 flex items-center justify-between rounded p-2 shadow">
							<div>{{ sources.length }} {{ $t('sources').toLowerCase() }}</div>
							<NTooltip :content="$t('addSource')">
								<template #trigger>
									<NButton
										type="primary"
										size="small"
										@click="addSource()"
									>
										<template #icon>
											<g-icon name="add" />
										</template>
										{{ $t('new') }}
									</NButton>
								</template>
								{{ $t('addSource') }}
							</NTooltip>
						</div>
						<div class="g-bg-1 mb-3 flex items-center justify-between rounded p-2 shadow">
							<g-alert
								v-if="sources.length <= 0"
								:title="$t('noResult')"
							/>
							<NTable
								v-else
								striped
								size="small"
							>
								<thead>
									<tr>
										<th style="width: 90px">ID</th>
										<th>{{ $t('name') }}</th>
										<th>{{ $t('client') }}</th>
										<th style="width: 70px"></th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(item, index) in sources"
										:key="index"
									>
										<td class="px-2">
											<g-id :id="item.sourceId" />
										</td>
										<td>
											<div class="flex gap-2">
												<img
													:alt="item.client"
													style="height: 18px; margin-right: 4px"
													:src="sourceIcon(item)"
												/>
												{{ item.sourceName }}
											</div>
										</td>
										<td>{{ item.client }}</td>
										<td class="el-text-left">
											<NButton
												quaternary
												@click="selectSource(item)"
											>
												<template #icon>
													<IconComponent name="Edit" />
												</template>
												{{ $t('edit') }}
											</NButton>
										</td>
									</tr>
								</tbody>
							</NTable>
						</div>
						<source-control
							v-if="showControl"
							:current="current"
							@close="showControl = false"
							@save="sourceSaved()"
						/>
					</div>
				</template>
			</div>
		</settings-view>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import SettingsView from '@/views/settings/SettingsView.vue'
import SourceControl from '@/views/settings/source-manager/SourceControl.vue'
import type { SourceType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const loading = ref()

const sources = ref([])
const current = ref({})
const showControl = ref(false)

const sourceSaved = () => {
	showControl.value = false
	list()
}

const selectSource = (item: SourceType) => {
	current.value = item
	showControl.value = true
}

const addSource = () => {
	current.value = { client: 'mysql', credentials: {} } as SourceType
	showControl.value = true
}

const list = async () => {
	loading.value = true
	sources.value = await useApi().get('api/source/list')
	loading.value = false
}

const sourceIcon = (tb: SourceType) => {
	const image = `../../../assets//images/flow/bg-${tb.client}.png`
	return new URL(image, import.meta.url).href
}

onMounted(() => list())
</script>
