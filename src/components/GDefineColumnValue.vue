<template>
	<div
		v-if="localTask.schema && localTask.schema[type] && initPage"
		class="g-define-column-value"
	>
		<div class="control">
			<g-select-column
				v-model="possibles"
				:table-name="localTask.tableName"
				multiple
				@change="changeUpdates"
				@load-column-list="columns = $event"
			/>
		</div>
		<NCard content-style="padding: 10px">
			<div
				v-if="columns"
				class="control"
			>
				<table
					v-if="localTask.schema[type].length > 0"
					class="w-full table-auto"
				>
					<thead>
						<tr class="vertical-mid border-b text-left *:p-1">
							<th>{{ $t('column') }}</th>
							<th>{{ $t('type') }}</th>
							<th>{{ $t('value') }}</th>
							<th style="width: 25px"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in localTask.schema[type]"
							:key="index"
							class="border-b *:p-1 odd:bg-paper-200"
						>
							<td>
								{{ item.id }}
								<g-icon :name="dataTypeIcon(item.dataType)" />
								{{ item.columnName }}
							</td>
							<td>
								<NSelect
									v-model:value="item.valueType"
									:options="[
										{
											value: 'value',
											label: $t('value')
										},
										{
											value: 'parameter',
											label: $t('parameter')
										},
										{
											value: 'computed',
											label: $t('computed')
										}
									]"
									class="min-w-[100px]"
								/>
							</td>
							<td>
								<div v-if="item.valueType === 'value'">
									<NInput
										v-model:value="item.value"
										:placeholder="$t('value')"
										type="text"
									/>
								</div>
								<div v-else-if="item.valueType === 'parameter'">
									<NSelect
										v-model:value="item.value"
										class="w-100"
										filterable
										value-field="paramName"
										label-field="paramName"
										:options="useAppStore().params"
									/>
								</div>
								<template v-else-if="item.valueType === 'computed'">
									<div
										class="control"
										style="min-height: 90px"
									>
										<code-editor
											v-model="item.content"
											class="h-[90px] min-w-[250px] overflow-hidden rounded"
										/>
									</div>
								</template>
							</td>
							<td>
								<NButton
									size="tiny"
									quaternary
									type="error"
									@click="removeField(item.columnName)"
								>
									<template #icon>
										<g-icon name="delete" />
									</template>
								</NButton>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</NCard>
	</div>
	<NAlert
		v-else
		:closable="false"
		:title="$t('addField')"
	/>
</template>

<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import { useAppStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { NAlert, NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'

const { dataTypeIcon } = useDataType()

defineEmits(['change'])

const props = defineProps({
	type: {
		type: String,
		required: true,
		default: 'update'
	},
	localTask: {
		type: Object,
		required: true
	}
})

const columns = ref<FieldType[]>([])
const possibles = ref<string[]>([])
const initPage = ref(false)

const removeField = (columnName: string) => {
	props.localTask.schema[props.type] = props.localTask.schema[props.type].filter((o) => o.columnName !== columnName)
	possibles.value = possibles.value.filter((o) => o !== columnName)
	changeUpdates()
}

const changeUpdates = () => {
	const preserveOriginal = cloneDeep(props.localTask.schema[props.type])

	// add those that is not already
	possibles.value.forEach((p) => {
		if (!preserveOriginal.some((u) => u.columnName === p)) {
			const col = columns.value.find((c) => c.columnName === p)
			if (col) {
				props.localTask.schema[props.type].push({
					...col,
					valueType: 'value',
					value: ''
				})
			}
		}
	})

	props.localTask.schema[props.type] = props.localTask.schema[props.type].filter((o) =>
		possibles.value.includes(o.columnName)
	)
}

onMounted(() => {
	possibles.value = props.localTask.schema[props.type].map((o) => o.columnName || o.alias)
	initPage.value = true
})
</script>
