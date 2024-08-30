<template>
	<div
		v-if="props.formData.formElements"
		:key="useFormStore().refreshKey"
		class="report-form"
	>
		<vue-draggable
			v-model="props.formData.formElements"
			group="grid"
			class="h-full w-full py-2"
		>
			<div
				v-for="(element, elementIndex) of props.formData.formElements"
				:key="element.id"
				class="py-1"
				@mouseover="onMove('in')"
				@mouseout="onMove('out')"
			>
				<n-grid
					:cols="Object.keys(element.cols).length"
					:x-gap="5"
					:y-gap="5"
				>
					<n-grid-item
						v-for="(fields, colId) in element.cols"
						:key="colId"
						class="min-h-[40px]"
					>
						<vue-draggable
							:key="colId"
							v-model="props.formData.formElements[elementIndex].cols[colId]"
							:group="{
								name: 'fields'
							}"
							class="h-full w-full"
						>
							<report-form-field
								v-for="field in fields"
								:key="field.id"
								:field="field"
								:edit="edit"
								:is-filter="isFilter"
								class="w-full py-1"
								@run="$emit('run')"
								@click="selectField(field)"
							/>
						</vue-draggable>
					</n-grid-item>
				</n-grid>
				<template v-if="edit">
					<div class="control-secondary my-1 mb-3 flex items-center justify-end gap-2">
						<NButton
							v-if="Object.keys(element.cols).length > 1"
							text
							type="error"
							@click="removeColumn(element.id)"
						>
							<template #icon>
								<g-icon
									name="removeColumn"
									:height="18"
								/>
							</template>
						</NButton>
						<NButton
							text
							type="default"
							@click="addColumn(element.id)"
						>
							<template #icon>
								<g-icon name="addColumn" />
							</template>
						</NButton>
						<NDivider vertical />
						<NButton
							text
							size="large"
							type="error"
							@click="removeContainer(element.id)"
						>
							<template #icon>
								<g-icon name="close" />
							</template>
						</NButton>
					</div>
					<NDivider />
				</template>
			</div>
		</vue-draggable>
	</div>
</template>
<script setup lang="ts">
import { useFormStore } from '@/stores'
import ReportFormField from '@/views/report/report-form/ReportFormField.vue'
import type { FormFieldType, FormType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { onBeforeMount, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

defineEmits(['addColumn', 'removeColumn', 'run', 'change'])
const props = defineProps<{ formData: FormType; edit: boolean; isFilter: boolean }>()

const isDragging = ref(false)
const selectField = (field: FormFieldType) => {
	useFormStore().currentField = field
}

const removeContainer = (id: string) => {
	props.formData.formElements = props.formData.formElements.filter((element) => element.id !== id)
}

const onMove = (type) => {
	isDragging.value = type === 'in'
}

const addColumn = (id: string) => {
	props.formData.formElements.forEach((element) => {
		if (element.id === id) {
			element.cols[getId()] = []
		}
	})
}

const removeColumn = (id: string) => {
	props.formData.formElements.filter((element) => {
		if (element.id === id) {
			const cols = Object.keys(element.cols)
			delete element.cols[cols[cols.length - 1]]
		}
	})
}

// const defineFieldValuesByParams = () => {
//     const params = useAppStore().params.reduce((acc, param) => {
//         acc[param.paramName] = param.paramValue
//         return acc
//     }, {})
//
//     props.formData.formElements.forEach((element) => {
//         Object.values(element.cols).forEach((fields) => {
//             fields.forEach((field) => {
//                 // value is an array list
//                 if (checkIfValueIsAList(field)) {
//                     field.value = [params[field.paramName], params[field.extraParamName]]
//                 } else {
//                     if (field.paramName) {
//                         field.value = params[field.paramName]
//                     }
//                 }
//             })
//         })
//     })
// }

// const checkIfValueIsAList = (field: FormFieldType) => {
//     if (['slider'].includes(field.type)) {
//         return true
//     }
//
//     if (['date', 'datetime', 'time'].includes(field.type)) {
//         if (field.isRange) {
//             return true
//         }
//     }
//
//     return false
// }
//
onBeforeMount(() => {
	// defineFieldValuesByParams()
})
</script>
