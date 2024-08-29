<template>
	<div class="task-builder-sql h-full w-full">
		<code-editor
			:key="sql"
			v-model="sql"
			class="h-full w-full"
			readonly
		/>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { BuilderTaskType } from '@gaio/shared/types'
import { format as sqlFormatter } from 'sql-formatter'
import { onMounted, ref } from 'vue'

const props = defineProps<{ localTask: BuilderTaskType }>()

const sql = ref('')

onMounted(async () => {
	const { query } = await useApi().post('api/builder/sql', {
		body: {
			taskData: props.localTask,
			params: []
		}
	})

	sql.value = sqlFormatter(query as string)
})
</script>
