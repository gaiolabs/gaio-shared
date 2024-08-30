<template>
	<g-dialog @close="$emit('close')">
		<template #title>{{ $t('taskUnpivot') }}</template>
		<template #content>
			<div v-if="localTask">
				<div class="flex w-full gap-2">
					<div class="flex w-full flex-col gap-1">
						<div class="control-label">
							{{ $t('task') }}
						</div>

						<n-input
							v-model:value="localTask.label"
							name="task"
							:placeholder="$t('taskLabel')"
						/>
					</div>
					<div class="flex w-full flex-col gap-1">
						<label class="font-semibold text-neutral-500">
							{{ $t('resultTable') }}
						</label>
						<n-input
							v-model:value="localTask.resultTable"
							v-alpha
							:placeholder="$t('selectTable')"
						>
							<template #prefix>
								<n-tooltip
									:arrow-style="{ background: 'white' }"
									:style="{ background: 'white', color: 'black', maxWidth: '300px' }"
									trigger="hover"
								>
									<template #trigger>
										<g-icon
											name="clock"
											:color="localTask?.resultTable?.startsWith('tmp_') ? '#E32' : ''"
											:height="14"
										/>
									</template>
									<template #header>
										<strong>{{ $t('temporaryTable') }}</strong>
									</template>
									<template #default>
										<span v-html="$t('temporaryTableInfo')"></span>
									</template>
								</n-tooltip>
							</template>
						</n-input>
						<small>{{ $t('sourceTable') }}: {{ localTask.tableName }}</small>
					</div>
				</div>

				<div class="control mb-2">
					<div class="control-label">
						{{ $t('unpivotColumns') }}
					</div>
					<g-select-column
						v-model="localTask.unpivotColumns"
						:table-name="localTask.tableName"
						multiple
					/>
				</div>

				<div class="control flex gap-2">
					<div class="grow">
						<div class="control-label">
							{{ $t('pivotValue') }}
						</div>
						<g-select-column
							v-model="localTask.orderBy"
							:table-name="localTask?.tableName"
						/>
					</div>
					<div class="grow">
						<div class="control-label">
							{{ $t('pivotSort') }}
						</div>
						<n-select
							v-model:value="localTask.orderByType"
							size="small"
							:options="[
								{
									label: $t('none'),
									value: ''
								},
								{
									label: $t('asc'),
									value: 'asc'
								},
								{
									label: $t('desc'),
									value: 'desc'
								}
							]"
						/>
					</div>
				</div>

				<div class="control flex gap-2">
					<div class="grow">
						<div class="control-label">
							{{ $t('pivotExtraColumns') }}
						</div>
						<g-select-column
							v-model:value="localTask.extraColumns"
							:table-name="localTask.tableName"
							multiple
						/>
					</div>
					<div class="grow">
						<div class="control-label">
							{{ $t('pivotExtraColumnsPosition') }}
						</div>
						<n-select
							v-model:value="localTask.extraColumnPosition"
							:options="[
								{
									label: $t('atStart'),
									value: 'start'
								},
								{
									label: $t('atEnd'),
									value: 'end'
								}
							]"
						/>
					</div>
				</div>
			</div>
			<div class="flex justify-end bg-elevation-0 px-4 py-2">
				<NButton
					type="primary"
					@click="save()"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</template>
	</g-dialog>
</template>
<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { UnpivotTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close'])
const localTask = ref<UnpivotTaskType>()

const save = () => {
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask.value,
			sources: [
				useDefault({
					type: 'table',
					base: {
						...useAppStore().appInfo,
						...localTask.value,
						label: localTask.value.tableName,
						tableName: localTask.value.tableName
					}
				})
			],
			targets: [
				useDefault({
					type: 'table',
					base: {
						...useAppStore().appInfo,
						...localTask.value,
						label: localTask.value.resultTable,
						tableName: localTask.value.resultTable
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'unpivot',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
})
</script>
