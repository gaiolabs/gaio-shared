<template>
	<div
		v-if="current"
		class="task-report-fields py-1"
	>
		<div>
			<div
				v-if="!chooseTable"
				class="mb-3 flex items-center justify-between border-b px-1 pt-2 font-bold"
			>
				{{ current.tableName }}
				<div>
					<NTooltip>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
							>
								<template #icon>
									<g-icon name="exchange" />
								</template>
							</NButton>
						</template>
						<div>
							{{ $t('exchangeTableMessage') }}
						</div>
					</NTooltip>

					<NTooltip>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
								@click="$emit('viewTable')"
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
				</div>
			</div>
			<div v-else>
				<g-select-table v-model="current.tableName" />
			</div>
		</div>
		<div class="flex items-center justify-between">
			<NButton
				size="tiny"
				@click="addAllFields()"
			>
				{{ $t('addAll') }}
			</NButton>
			<div class="flex gap-1">
				<NTooltip>
					<template #trigger>
						<div>#{{ columns.length }}</div>
					</template>

					<div>
						{{ $t('columns') }}
					</div>
				</NTooltip>
			</div>
		</div>

		<div class="my-2">
			<NInput
				v-model:value="searchTerm"
				:placeholder="$t('filter')"
			>
				<template #prefix>
					<g-icon name="filter" />
				</template>
			</NInput>
		</div>

		<div>
			<vue-draggable
				:key="columns?.length"
				:model-value="columns"
				group="fields"
				class="drag-table"
			>
				<div
					v-for="field of $filterBy(columns, 'columnName', searchTerm)"
					:key="field.id"
					class="cursor-pointer overflow-hidden truncate border-b py-1 last:border-b-0 hover:bg-paper-200 dark:hover:bg-carbon-200"
					@dblclick="addField(field)"
				>
					<g-icon
						:name="dataTypeIcon(field.dataType)"
						color="var(--elevation-primary)"
					/>
					{{ field.columnName }}
				</div>
			</vue-draggable>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useReportStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const { current } = useReportStore()

defineEmits(['viewTable'])
const { dataTypeIcon } = useDataType()

const chooseTable = ref(false)
const searchTerm = ref('')
const addAllFields = () => {}

const addField = (field: FieldType) => {
	const newField = useReportStore().defineFieldOptions(field)

	useReportStore().current.schema.select.push(newField)
	useReportStore().currentField = newField
	useReportStore().refreshPreview()
}

const columns = ref<FieldType[]>([])

const loadFields = () => {
	useApi()
		.post('api/table/field', {
			body: {
				taskData: current
			}
		})
		.then(
			(res) =>
				(columns.value = res.data.map((o: FieldType) => {
					return {
						...o,
						id: getId()
					}
				}))
		)
}

onMounted(() => {
	loadFields()
})
</script>
