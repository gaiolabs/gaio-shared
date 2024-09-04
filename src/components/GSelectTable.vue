<template>
	<div v-if="isListFormat">
		<NScrollbar>
			<NList>
				<NListItem
					v-for="table in tableList"
					:key="table.value"
					clickable
				>
					<div class="flex flex-row items-center justify-between w-full">
						<span>{{ table.label }}</span>
						<NTooltip
							:persistent="false"
							:show-after="1500"
							:content="$t('viewTable')"
						>
							<template #trigger>
								<NButton :bordered="false">
									<template #icon>
										<GIcon
											:name="'eye'"
											color="gray"
										/>
									</template>
								</NButton>
							</template>
							{{ $t('openTableData') }}
						</NTooltip>
					</div>
				</NListItem>
			</NList>
		</NScrollbar>
	</div>

	<NSelect
		v-else
		v-model:value="selected"
		:options="tableList"
		:placeholder="$t('selectTable')"
		:clearable="clearable"
		:multiple="multiple"
		:disabled="disabled"
		filterable
	/>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import { NButton, NList, NListItem, NScrollbar, NSelect, NTooltip } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import GIcon from './GIcon.vue'

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
	defineProps<{
		modelValue?: string | string[]
		appId?: string
		clearable?: boolean
		multiple?: boolean
		disabled?: boolean
		isListFormat?: boolean
	}>(),
	{
		clearable: true,
		multiple: false,
		appId: undefined,
		modelValue: undefined,
		disabled: false,
		isListFormat: false
	}
)

const selected = ref(props.modelValue)
const tableList = ref([])
console.log('tableList', tableList)

watch(
	() => selected.value,
	() => emit('update:modelValue', selected.value)
)

const loadTableList = () => {
	const taskData = {
		...useAppStore().appInfo,
		sourceType: 'bucket',
		client: 'clickhouse'
	}

	if (props.appId) {
		taskData.appId = props.appId
	}

	useApi()
		.post('api/table/list', {
			body: {
				taskData
			}
		})
		.then((res) => (tableList.value = res.data.map((item) => ({ label: item.tableName, value: item.tableName }))))
}

onMounted(() => loadTableList())
</script>
