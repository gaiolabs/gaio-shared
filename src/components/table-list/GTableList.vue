<template>
	<div>
		<TableDetailModal
			:open-modal="shouldOpenTableView"
			:table-name="selectTableView"
			@update:show="shouldOpenTableView = $event"
		/>
		<NSkeleton
			v-if="loading"
			text
			:repeat="1"
		/>
		<NCheckboxGroup
			v-else
			v-model:value="selected"
			:disabled="disabled"
		>
			<div class="flex w-full flex-col">
				<div class="flex items-center justify-between w-full mb-2">
					<NTooltip
						:persistent="false"
						:show-after="1500"
					>
						<template #trigger>
							<NButton
								:bordered="true"
								class="!w-[50%]"
								@click="() => selectAllFilteredTables()"
							>
								<template #icon>
									<GIcon
										:name="'checkAll'"
										color="gray"
									/>
								</template>
							</NButton>
						</template>
						{{ $t('selectAllFiltered') }}
					</NTooltip>
					<NTooltip
						:persistent="false"
						:show-after="1500"
						:content="$t('viewTable')"
					>
						<template #trigger>
							<NButton
								:bordered="true"
								class="!w-[50%]"
								@click="() => unselectAllFilteredTables()"
							>
								<template #icon>
									<GIcon
										:name="'eraser'"
										color="gray"
									/>
								</template>
							</NButton>
						</template>
						{{ $t('unselectAllFiltered') }}
					</NTooltip>
				</div>
				<NInput
					v-model:value="filteredName"
					:clearable="true"
					class="mb-4"
					size="small"
					:placeholder="$t('tableName')"
				/>
			</div>
			<NVirtualList
				:item-size="10000"
				:items="filteredTableList ?? tableList"
			>
				<template #default="{ item }">
					<div
						:key="item.value"
						class="flex flex-row items-center justify-between w-full"
					>
						<NCheckbox
							:value="item.value"
							:label="item.label"
						/>
						<NTooltip
							:persistent="false"
							:show-after="1500"
							:content="$t('viewTable')"
						>
							<template #trigger>
								<NButton
									:bordered="false"
									@click="(selectTableView = item.value), (shouldOpenTableView = true)"
								>
									<template #icon>
										<GIcon
											:name="'eye'"
											color="gray"
										/>
									</template>
								</NButton>
							</template>
							{{ $t('viewTable') }}
						</NTooltip>
					</div>
				</template>
			</NVirtualList>
		</NCheckboxGroup>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import { NButton, NCheckbox, NCheckboxGroup, NInput, NSkeleton, NTooltip, NVirtualList } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import GIcon from '../GIcon.vue'
import TableDetailModal from '../tabel-detail-modal/TableDetailModal.vue'

type TableDataType = {
	label: string
	value: string
}

const emit = defineEmits(['update:modelValue', 'update:show'])
const {
	appId = undefined,
	modelValue = undefined,
	disabled = false,
} = defineProps<{
	appId?: string
	modelValue?: string[]
	disabled?: boolean
}>()

const selected = ref(modelValue)
const tableList = ref<TableDataType[]>([])
const filteredTableList = ref<TableDataType[] | null>(null)
const selectTableView = ref('')
const filteredName = ref('')
const shouldOpenTableView = ref(false)
const loading = ref(true)

watch(
	() => selected.value,
	() => emit('update:modelValue', selected.value),
)

watch(filteredName, (newValue) => {
	const filteredList = tableList.value.filter((item) =>
		item.label.toLocaleLowerCase().includes(newValue.toLocaleLowerCase()),
	)
	filteredTableList.value = filteredList.length > 0 ? filteredList : null
})

const selectAllFilteredTables = () =>
	(selected.value =
		filteredTableList.value ?
			filteredTableList.value.map((item) => item.value)
		:	tableList.value.map((item) => item.value))

const unselectAllFilteredTables = () => {
	if (!filteredTableList.value) {
		selected.value = []
		return
	}
	const valuesOfFiltered = new Set(filteredTableList.value.map((item) => item.value))
	selected.value = selected.value.filter((item) => !valuesOfFiltered.has(item))
}

const loadTableList = () => {
	const taskData = {
		...useAppStore().appInfo,
		sourceType: 'bucket',
		client: 'clickhouse',
	}

	if (appId) {
		taskData.appId = appId
	}

	useApi()
		.post('api/table/list', {
			body: {
				taskData,
			},
		})
		.then((res) => {
			loading.value = false
			const listTable = res.data.map((item: any) => ({
				label: item.tableName,
				value: item.tableName,
			})) as TableDataType[]

			const [newSelectList, newNotSelectList]: TableDataType[][] = listTable.reduce(
				([select, notSelect]: TableDataType[][], item: TableDataType) => {
					if (selected.value.includes(item.value)) {
						select.push(item)
					} else {
						notSelect.push(item)
					}
					return [select, notSelect]
				},
				[[], []],
			)

			newSelectList.sort((a, b) => a.value.localeCompare(b.value))
			newNotSelectList.sort((a, b) => a.value.localeCompare(b.value))

			tableList.value = [...newSelectList, ...newNotSelectList]
		})
}

onMounted(() => loadTableList())
</script>
