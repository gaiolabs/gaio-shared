<template>
	<div class="task-builder-options-filter">
		<div class="mx-1 mb-2 rounded-[8px] bg-elevation-1 p-2">
			<div class="mb-2">
				<div class="">{{ $t('operator') }}</div>
				<NSelect
					v-model:value="localField.field.operator"
					size="small"
					default-value="="
					:placeholder="$t('select')"
					:options="operators"
					@update:value="changeOperator"
				/>
			</div>
			<div class="mb-2">
				<div class="">{{ $t('type') }}</div>
				<NSelect
					v-model:value="localField.field.valueType"
					size="small"
					default-value="value"
					:placeholder="$t('chooseAType')"
					:options="valueTypeList"
				/>
			</div>
			<!--IS VALUE -->
			<div class="">{{ $t('value') }}</div>

			<template v-if="!['isNull', 'isNotNull'].includes(localField.field.operator)">
				<!--PARAMETER-->
				<template v-if="localField.field.valueType === 'parameter'">
					<NSelect
						v-model:value="localField.field.value"
						size="small"
						:placeholder="$t('chooseAParameter')"
						:options="parameterList"
					/>
					<div v-if="hasExtraValue" class="mt-2">
						<div>
							{{ $t('andValue') }}
						</div>
						<NSelect
							v-model:value="localField.field.extraValue"
							size="small"
							:placeholder="$t('chooseAParameter')"
							:options="parameterList"
						/>
					</div>
				</template>
				<!--COMPUTED-->
				<template v-else-if="localField.field.valueType === 'computed'">
					<div class="overflow-hidden rounded-b-[6px]">
						<code-editor v-model="localField.field.value" style="height: 150px" />
					</div>
					<div v-if="hasExtraValue" class="mt-2">
						<div>
							{{ $t('andValue') }}
						</div>
						<code-editor v-model="localField.field.extraValue" style="height: 150px" />
					</div>
				</template>
				<!--DATE & DATE LITERAL-->
				<template v-else-if="isLocalFieldADateType">
					<g-data-literal v-model="localField.field.value" />
					<div v-if="hasExtraValue" class="mt-2">
						<div>
							{{ $t('andValue') }}
						</div>
						<g-data-literal v-model="localField.field.extraValue" />
					</div>
				</template>
				<!--COMMON VALUE-->
				<template v-if="localField.field.valueType === 'value'">
					<!--SINGLE VALUE-->
					<template v-if="!isWhereIn.includes(localField.field.operator)">
						<NInput v-model:value="localField.field.value" size="small" :placeholder="$t('typeHere')">
							<template #suffix>
								<NButton size="tiny" quaternary @click="previewColumn()">
									<g-icon name="eye" />
								</NButton>
							</template>
						</NInput>
						<div v-if="hasExtraValue" class="mt-2">
							<div>
								{{ $t('andValue') }}
							</div>
							<NInput
								v-if="!isWhereIn.includes(localField.field.operator)"
								v-model:value="localField.field.extraValue"
								size="small"
								:placeholder="$t('typeHere')"
							/>
						</div>
					</template>
					<template v-else>
						<NSelect
							v-model:value="localField.field.value"
							size="small"
							filterable
							multiple
							tag
							:placeholder="$t('inputAndCreate')"
							:options="
								previewList.map((o) => {
									return {
										label: o.value,
										value: o.value
									}
								})
							"
						/>
						<div v-if="hasExtraValue" class="mt-2">
							<div>
								{{ $t('andValue') }}
							</div>
							<NSelect
								v-model:value="localField.field.extraValue"
								size="small"
								filterable
								multiple
								tag
								:placeholder="$t('inputAndCreate')"
								:options="
									previewList.map((o) => {
										return {
											label: o.value,
											value: o.value
										}
									})
								"
							/>
						</div>
					</template>
					<div v-if="previewList?.length && !isWhereIn.includes(localField.field.operator)" class="my-3">
						<NList bordered>
							<NListItem v-for="item in previewList" :key="item.value">
								<div class="flex cursor-pointer items-center justify-between">
									<div class="flex items-center gap-1">
										<NButton text size="tiny" @click="defineValue(item.value)">
											<template #icon>
												<g-icon name="plus" />
											</template>
										</NButton>
										{{ item.value }}
									</div>
									<div v-if="item.qtd" class="italic">
										<NDivider vertical class="mx-0" />
										{{ item.qtd }}
									</div>
								</div>
							</NListItem>
						</NList>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'
import type { BuilderTaskType } from '@gaio/shared/types'
import { isArray } from 'lodash-es'
import { computed, type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { dataTypeName } = useDataType()
const { operatorsFilters } = useHelper()
const { t } = useI18n()

const props = defineProps({
	localField: {
		type: Object as PropType<{ type: string; field: Partial<FieldType> }>,
		required: true
	},
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})

const previewList = ref<{ value: unknown; qtd?: number }[]>([])
const isWhereIn = ['in', 'notIn']

const isLocalFieldADateType = computed(() => {
	return (
		`${props.localField.field.dataType}`.includes('Date') &&
		props.localTask.client === 'clickhouse' &&
		!isWhereIn.includes(props.localField.field.operator)
	)
})

const hasExtraValue = computed(() => {
	return ['between', 'notBetween'].includes(props.localField.field.operator)
})

const operators = computed(() => {
	let op = dataTypeName(props.localField.field.dataType)

	if (op !== 'number' && op !== 'text') {
		op = 'date'
	}
	return (operatorsFilters[op] || []).map((o) => {
		return {
			label: t(o.name),
			value: o.operator
		}
	})
})

const valueTypeList = ['value', 'parameter', 'computed'].map((o) => ({
	label: t(o),
	value: o
}))

const parameterList = computed(() => {
	return useAppStore().params.map((o) => {
		return {
			label: o.paramName,
			value: o.paramName
		}
	})
})

const defineValue = (value) => {
	if (typeof value === 'string') {
		props.localField.field.value = value
	} else if (isArray(props.localField.field.value)) {
		props.localField.field.value.push(value)
	} else {
		props.localField.field.value = [value]
	}
}

const changeOperator = () => {
	if (props.localField.field.operator === 'isNull' || props.localField.field.operator === 'isNotNull') {
		props.localField.field.value = null
	} else if (props.localField.field.operator === 'in' || props.localField.field.operator === 'notIn') {
		previewColumn()
		props.localField.field.value = []
	} else if (props.localField.field.operator === 'between') {
		// props.localField.field.value = [null, null];
	} else {
		props.localField.field.value = null
	}
}

const previewColumn = async () => {
	previewList.value = []
	if (props.localField.field.valueType === 'value') {
		const computed = {
			type: 'computed',
			alias: 'qtd',
			content: 'count(*)',
			dataType: 'Nullable(String)',
			columnName: 'qtd',
			computedId: 'XHnHzK',
			order: 'desc'
		}
		const fieldData = {
			...props.localField.field,
			type: 'value',
			valueType: 'value',
			alias: 'value'
		}

		const { data } = await useApi().post('api/table/rows', {
			body: {
				taskData: {
					...props.localTask,
					schema: {
						select: [fieldData, computed],
						group: [fieldData],
						sort: [computed],
						computed: [computed],
						limit: 15
					}
				}
			}
		})
		previewList.value = data
	} else {
		const fieldData = {
			...props.localField.field,
			type: 'value',
			valueType: 'value',
			alias: 'value',
			distinct: true,
			order: 'desc'
		}

		const { data } = await useApi().post('api/table/rows', {
			body: {
				taskData: {
					...props.localTask,
					schema: {
						select: [fieldData],
						sort: [fieldData],
						limit: 15
					}
				}
			}
		})

		previewList.value = data
	}
}
</script>
