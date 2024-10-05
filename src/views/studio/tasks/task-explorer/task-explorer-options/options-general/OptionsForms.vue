<template>
	<div class="options-forms control-secondary">
		<NSelect
			v-model:value="current.settings.forms"
			size="small"
			multiple
			:options="formList"
		/>

		<div class="mt-2">
			<NCheckbox
				v-model:checked="useReportStore().current.settings.formOnFirstColumn"
				:label="$t('formAtStart')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAppStore, useReportStore } from '@/stores'

const { current } = useReportStore()

const formList = useAppStore().flowList.map((item) => ({
	label: item.flowName,
	value: item.flowId
}))
</script>
