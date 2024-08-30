<template>
	<div class="task-builder-fields overflow-hidden p-1">
		<div>
			<NCollapse
				class="rounded-[4px] bg-paper-100 dark:bg-carbon-200"
				arrow-placement="right"
			>
				<NCollapseItem
					v-for="(table, tableIndex) of tableList"
					:key="`${table.databaseName}-${table.tableName}`"
					:title="table.tableName"
					:name="table.tableName"
				>
					<template #header>
						<div class="flex items-center gap-1">
							<g-icon name="table" />
							{{ table.tableName }}
						</div>
					</template>
					<div class="mx-2">
						<div class="flex items-center justify-between">
							<NButton
								size="tiny"
								@click="addAllFields(tableIndex)"
							>
								{{ $t('addAll') }}
							</NButton>
							<div class="flex gap-1">
								<NTooltip>
									<template #trigger>
										<NButton
											size="tiny"
											@click="$emit('viewTable', table)"
										>
											<template #icon>
												<g-icon name="eye" />
											</template>
										</NButton>
									</template>
									<div>
										{{ $t('viewTable') }}
									</div>
								</NTooltip>
								<NTooltip>
									<template #trigger>
										<div>#{{ table.fields.length }}</div>
									</template>

									<div>
										{{ $t('columns') }}
									</div>
								</NTooltip>
							</div>
						</div>

						<div class="my-2">
							<NInput
								v-model:value="searchTerm[table.tableName]"
								:placeholder="$t('filter')"
							>
								<template #prefix>
									<g-icon name="filter" />
								</template>
							</NInput>
						</div>

						<div>
							<drag
								:list="$filterBy(table.fields, 'columnName', searchTerm[table.tableName])"
								:group="{
									name: 'items',
									pull: 'clone',
									put: false
								}"
								:sort="false"
							>
								<div
									v-for="field of $filterBy(table.fields, 'columnName', searchTerm[table.tableName])"
									:key="field.id"
									class="overflow-hidden truncate border-b py-1 last:border-b-0"
								>
									<g-icon
										:name="dataTypeIcon(field.dataType)"
										color="var(--elevation-primary)"
									/>
									{{ field.columnName }}
								</div>
							</drag>
						</div>
					</div>
				</NCollapseItem>
				<NCollapseItem name="computed">
					<template #header>
						<div class="flex items-center gap-1">
							<g-icon name="computed" />
							{{ $t('computed') }}
						</div>
					</template>
					<div class="mx-2">
						<div class="mb-2">
							<NInput
								v-model:value="searchTerm['computed']"
								:placeholder="$t('filter')"
							>
								<template #prefix>
									<g-icon name="filter" />
								</template>
							</NInput>
						</div>

						<div>
							<drag
								:list="$filterBy(computedList, 'columnName', searchTerm['computed'])"
								:group="{
									name: 'items',
									pull: 'clone',
									put: false
								}"
								:sort="false"
							>
								<div
									v-for="field of $filterBy(computedList, 'columnName', searchTerm['computed'])"
									:key="field.id"
									class="overflow-hidden truncate border-b py-1 last:border-b-0"
									@click="$emit('editComputed', field)"
								>
									<g-icon
										:name="dataTypeIcon(field.dataType)"
										color="var(--elevation-primary)"
									/>
									{{ field.columnName }}
								</div>
							</drag>
						</div>
					</div>
				</NCollapseItem>
				<NCollapseItem
					v-if="aggregationList.length"
					name="aggregation"
				>
					<template #header>
						<div class="flex items-center gap-1">
							<g-icon name="aggregated" />
							{{ $t('aggregated') }}
						</div>
					</template>
					<div class="mx-2">
						<div class="mb-2">
							<NInput
								v-model:value="searchTerm['aggregated']"
								:placeholder="$t('filter')"
							>
								<template #prefix>
									<g-icon name="filter" />
								</template>
							</NInput>
						</div>
						<div>
							<drag
								:list="$filterBy(aggregationList, 'columnName', searchTerm['aggregated'])"
								:group="{
									name: 'items',
									pull: 'clone',
									put: false
								}"
								:sort="false"
							>
								<div
									v-for="field of $filterBy(aggregationList, 'columnName', searchTerm['aggregated'])"
									:key="field.id"
									class="overflow-hidden truncate border-b py-1 last:border-b-0"
								>
									<g-icon
										:name="dataTypeIcon(field.dataType)"
										color="var(--elevation-primary)"
									/>
									{{ field.columnName }}
								</div>
							</drag>
						</div>
					</div>
				</NCollapseItem>
			</NCollapse>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useHelper from '@/composables/useHelper'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import { uniqBy } from 'lodash-es'
import { computed, onMounted, type PropType, ref } from 'vue'
import { VueDraggableNext as Drag } from 'vue-draggable-next'

const { dataTypeIcon } = useDataType()
defineEmits(['viewTable', 'editComputed'])

const props = defineProps({
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})

const tableList = ref<
	{
		databaseName: string
		tableName: string
		fields: FieldType[]
	}[]
>([])

const computedList = computed(() => {
	return props.localTask.schema.computed || []
})

const aggregationList = computed(() => {
	return props.localTask.schema.select.filter((o) => o.type !== 'value' && !o.computedId) || []
})

const currentDatabaseName = getBucketNameFromAppId(props.localTask.appId)

const searchTerm = ref<Record<string, string>>({})

const addAllFields = (tableIndex) => {
	const table = tableList.value[tableIndex]
	const fields = table.fields.map((f) => {
		return {
			...f,
			id: useHelper().generateId()
		} as Partial<FieldType>
	})

	props.localTask.schema.select.push(...fields)
}

const loadTableSchema = async () => {
	const tables = [
		{
			databaseName: props.localTask.databaseName || getBucketNameFromAppId(props.localTask.appId),
			tableName: props.localTask.tableName
		}
	]

	for (const tb of props.localTask.schema.join) {
		if (tb.type !== 'raw') {
			tables.push({
				databaseName: tb.toDatabaseName || currentDatabaseName,
				tableName: tb.to
			})
			tables.push({
				databaseName: tb.byDatabaseName || currentDatabaseName,
				tableName: tb.by
			})
		} else {
			if (tb.refs.length > 0) {
				for (const r of tb.refs) {
					tables.push({
						databaseName: r.databaseName,
						tableName: r.tableName
					})
				}
			}
		}
	}

	let tableIndexPosition = {}

	for (const tb of uniqBy(tables, (t) => t.tableName + t.databaseName)) {
		tableIndexPosition[tb.tableName] = tableList.value.push({
			...tb,
			fields: []
		})
		useApi()
			.post('api/table/field', {
				body: {
					taskData: {
						...props.localTask,
						databaseName: tb.databaseName,
						tableName: tb.tableName
					}
				}
			})
			.then((res) => {
				tableList.value[tableIndexPosition[tb.tableName] - 1].fields = res.data.map((f) => {
					return {
						databaseName: tb.databaseName,
						tableName: tb.tableName,
						...f
					}
				})
			})
	}
}

onMounted(() => {
	loadTableSchema()
})
</script>

<style lang="scss">
.task-builder-fields {
	.n-collapse-item__header-main {
		display: flex;
		justify-content: space-between;
	}
}
</style>
