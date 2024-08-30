<template>
	<div class="report-table-form">
		<NDropdown
			trigger="click"
			:options="formOptions"
			@select="handleSelect"
		>
			<g-icon name="taskList" />
		</NDropdown>
		<!--        <report-form-->
		<!--            form-from="table"-->
		<!--            :sourceParams="row"-->
		<!--            :task="{ task, formId: current.formId, formLoadType: 'modal' }"-->
		<!--            @change="closeForm($event)"-->
		<!--            @close="current = {}"-->
		<!--            v-if="current && current.formId"-->
		<!--        />-->
	</div>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { ref } from 'vue'

defineEmits(['trigger'])
defineProps<{ task: ReportNodeType; row: Record<string, unknown> }>()
const current = ref({})
const forms = [
	{
		formId: '1',
		formName: 'Form 1'
	},
	{
		formId: '2',
		formName: 'Form 2'
	}
]

const formOptions = forms.map((form) => {
	return {
		label: form.formName,
		value: form.formId
	}
})

const handleSelect = (formId: string) => {
	if (formId) {
		const form = setForm(formId)
		if (form && form.formId) {
			current.value = form
		}
	}
}

const setForm = (formId: string) => {
	return forms.find((f) => f.formId === formId)
}
</script>
