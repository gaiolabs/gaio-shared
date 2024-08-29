<template>
	<div>
		<div
			v-if="showHeader"
			class="flex-between mb-2 flex"
		>
			<div>
				{{ $t('query') }}
			</div>
			<div>
				<n-button
					size="tiny"
					secondary
					type="error"
					@click="$emit('close')"
				>
					<template #icon>
						<g-icon name="close" />
					</template>
				</n-button>
			</div>
		</div>
		<code-editor
			:key="code"
			v-model="code"
			:readonly="true"
			language="sql"
			height="200px"
			class="min-h-[200px] overflow-hidden rounded"
		/>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import { format as prettySQL } from 'sql-formatter'
import { onMounted, ref } from 'vue'

defineEmits(['close'])

const props = defineProps({
	showHeader: {
		type: Boolean,
		default: true
	},
	localTask: {
		type: Object,
		required: true
	}
})

const loading = ref(false)
const code = ref('')

onMounted(async () => {
	loading.value = true

	const { query } = await useApi().post('api/builder/sql', {
		body: {
			taskData: props.localTask,
			params: useAppStore().params
		}
	})

	try {
		code.value = prettySQL(query, {
			language: 'mysql',
			tabWidth: 2,
			keywordCase: 'upper',
			linesBetweenQueries: 2
		})
	} catch (e) {
		code.value = ''
	}
})
</script>
