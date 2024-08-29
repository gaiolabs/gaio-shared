<template>
	<div class="options-field-condition control-secondary">
		<div class="control">
			<div class="control-label">{{ $t('type') }}</div>
			<n-select
				v-model:value="useReportStore().currentField.condType"
				:options="[
					{
						label: $t('none'),
						value: 'none'
					},
					{
						label: $t('background'),
						value: 'background'
					},
					{
						label: $t('fontColor'),
						value: 'fontColor'
					},
					{
						label: $t('tag'),
						value: 'tag'
					}
				]"
			/>
		</div>
		<div v-if="useReportStore().currentField.condType !== 'none'">
			<div class="control">
				<div class="control-label">
					{{ $t('conditionalColumn') }}
				</div>
				<n-select
					v-model:value="useReportStore().currentField.condColumnName"
					:options="
						useReportStore().current.schema.select.map((o) => {
							return {
								label: o.alias || o.columnName,
								value: o.alias || o.columnName
							}
						})
					"
				/>
			</div>
			<div class="control mt-2 w-full">
				<div class="control-label flex justify-between">
					{{ $t('rules') }}
					<g-icon
						name="add"
						@click="addNewRule()"
					/>
				</div>
				<div v-if="useReportStore().currentField.condRules">
					<div class="control">
						<n-table bordered>
							<tbody>
								<tr
									v-for="(val, index) in useReportStore().currentField.condRules"
									:key="index"
								>
									<td
										v-if="val.operator !== 'between'"
										style="width: 30px"
									>
										{{ val.operator }}
									</td>
									<td
										v-if="val.operator === 'between'"
										style="width: 30px; padding: 2px"
									>
										{{ $t('lang.BETWEEN') }}
									</td>
									<td
										v-if="val.operator !== 'between'"
										:style="`color: ${val.color}`"
									>
										{{ val.reference }}
									</td>
									<td
										v-if="val.operator === 'between'"
										:style="`color: ${val.color}`"
									>
										{{ val.reference }}
										{{ $t('and') }}
										{{ val.extraReference }}
									</td>
									<td
										v-if="useReportStore().currentField.condRules.filter((i) => i.icon).length > 0"
										style="width: 30px"
									>
										<g-app-icon
											v-if="val.icon"
											:style="`color: ${val.color}`"
											:name="val.icon"
										/>
										<span
											v-else
											:style="`background: ${val.color}`"
										>
											C
										</span>
									</td>
									<td style="width: 20px">
										<g-icon
											name="edit"
											@click="editRule(val)"
										/>
									</td>
									<td style="width: 20px">
										<g-icon
											name="delete"
											@click="removeRule(val.id)"
										/>
									</td>
								</tr>
							</tbody>
						</n-table>
					</div>
				</div>
			</div>

			<g-dialog
				v-if="showEdit"
				@close="showEdit = false"
			>
				<template #title>
					{{ $t('rules') }}
				</template>
				<template #content>
					<div
						v-if="newRule"
						class="color-body"
					>
						<div class="flex gap-2">
							<div class="control grow">
								<div class="control-label">
									{{ $t('conditional') }}
								</div>
								<n-select
									v-model:value="newRule.operator"
									:options="operators"
								/>
							</div>
							<div class="control grow">
								<div class="control-label">
									{{ $t('value') }}
								</div>
								<n-input
									v-model:value="newRule.reference"
									class="w-100"
									:placeholder="$t('value')"
								/>
							</div>
						</div>

						<div
							v-if="newRule.operator === 'between'"
							class="control"
						>
							<div class="control-label">
								{{ $t('betweenAnd') }}
							</div>
							<n-input
								v-model:value="newRule.extraReference"
								:placeholder="$t('value')"
							/>
						</div>

						<n-card content-style="padding: 10px">
							<div class="control">
								<div class="control-label">
									{{ $t('color') }}
								</div>
								<n-color-picker
									v-model:value="newRule.color"
									:modes="['hex']"
								/>
							</div>
						</n-card>

						<n-card
							content-style="padding: 10px"
							class="mt-2"
						>
							<n-space>
								<n-button
									size="small"
									:type="newRule.icon === undefined || newRule.icon === 'none' ? 'primary' : 'default'"
									@click="newRule.icon = undefined"
								>
									{{ $t('none') }}
								</n-button>
								<n-button
									v-for="item of commonIcons"
									:key="item"
									size="small"
									:type="newRule.icon === item ? 'primary' : 'default'"
									@click="newRule.icon = item"
								>
									<template #icon>
										<g-app-icon :name="item" />
									</template>
								</n-button>
								<n-button
									v-if="newRule.icon && !commonIcons.includes(newRule.icon)"
									size="small"
									type="primary"
								>
									<template #icon>
										<g-app-icon :name="newRule.icon" />
									</template>
								</n-button>
								<n-button
									size="small"
									@click="showIcon = !showIcon"
								>
									{{ $t('others') }}
								</n-button>
							</n-space>
						</n-card>

						<g-icon-finder
							v-if="showIcon"
							@choose="newRule.icon = $event"
							@close="showIcon = false"
						/>
					</div>
					<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
						<n-button
							type="primary"
							@click="saveNewRule()"
						>
							{{ $t('save') }}
						</n-button>
					</div>
				</template>
			</g-dialog>
		</div>
	</div>
</template>

<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import useHelper from '@/composables/useHelper'
import { useReportStore } from '@/stores'
import type { FieldRuleOptionsType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineEmits(['close'])
const { operatorsFilters } = useHelper()
const { dataTypeName } = useDataType()
const { t } = useI18n()
const showEdit = ref(false)
const showIcon = ref(false)

const newRule = ref<FieldRuleOptionsType>({})

const commonIcons = [
	'icon-trending-up',
	'icon-trending-down',
	'icon-arrow-big-up',
	'icon-arrow-big-down',
	'icon-corner-left-up',
	'icon-corner-left-down',
	'icon-circle',
	'icon-circle-x',
	'icon-ban',
	'icon-check'
]

const addNewRule = () => {
	newRule.value = {
		id: undefined,
		operator: '=',
		reference: '',
		extraReference: '',
		color: '#222',
		icon: 'home'
	}
	showEdit.value = true
}

const saveNewRule = () => {
	useReportStore().currentField.condRules = useReportStore().currentField.condRules || []
	if (newRule.value.id) {
		useReportStore().currentField.condRules = useReportStore().currentField.condRules.map((i) => {
			if (i.id === newRule.value.id) {
				return newRule.value
			}
			return i
		})
	} else {
		newRule.value.id = getId()
		useReportStore().currentField.condRules.push(newRule.value)
	}
	showEdit.value = false
}

const operators = computed(() => {
	let op = dataTypeName(useReportStore().currentField.dataType)

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

const removeRule = (id) => {
	useReportStore().currentField.condRules = useReportStore().currentField.condRules.filter((i) => i.id !== id)
}

const editRule = (val) => {
	newRule.value = Object.assign({}, val)
	showEdit.value = true
}
</script>
