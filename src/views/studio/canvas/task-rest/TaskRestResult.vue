<template>
	<div
		v-if="localTask"
		class="task-rest-result flex size-full flex-col gap-6 p-6"
	>
		<div class="control flex flex-col gap-1">
			<label
				class="control-label"
				for="result"
			>
				{{ $t('outputTable') }}
			</label>
			<n-input
				id="result"
				v-model:value="localTask.resultTable"
				placeholder=""
			/>
		</div>
		<div class="control flex flex-col gap-1">
			<label
				class="control-label"
				for="structure-id"
			>
				{{ $t('structureId') }}
			</label>
			<n-select
				id="structure-id"
				v-model:value="structureId"
				:options="structureOptions"
			/>
			<template v-if="structureId === 'manual'">
				<g-icon
					name="g-add el-cursor el-primary"
					@click="
						localTask.resultTableFields.push({
							columnName: '',
							type: 'value',
							dataType: 'Nullable(String)',
							columnLength: undefined
						})
					"
				/>
				<div
					v-for="(_, index) of localTask.resultTableFields"
					:key="index"
				>
					<g-define-column v-model="localTask.resultTableFields[index]" />
				</div>
			</template>
		</div>
		<n-card>
			<div
				v-if="localTask.tableName"
				class="flex flex-col gap-1"
			>
				<label
					class="control-label"
					for="input-columns"
				>
					{{ $t('inputColumnsToKeep') }}
				</label>
				<g-select-column
					id="input-columns"
					v-model="localTask.transferSourceData"
					:table-name="localTask.tableName"
					multiple
				/>
			</div>
			<div class="my-4 flex items-center gap-1">
				<n-switch v-model:value="localTask.resultTableTruncate" />
				<span>{{ $t('alwaysDropTable') }}</span>
			</div>
			<div class="flex flex-col gap-1">
				<label
					class="control-label"
					for="object-props"
				>
					{{ $t('objectProperties') }}
				</label>
				<n-input
					id="object-props"
					placeholder=""
				/>
			</div>
		</n-card>
	</div>
</template>
<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'
import { ref } from 'vue'

const structureId = ref('automatic')

const structureOptions = ref([
	{
		label: 'Automatic',
		value: 'automatic'
	},
	{
		label: 'Manual',
		value: 'manual'
	}
])
const { localTask } = withDefaults(defineProps<{ localTask: RestTaskType }>(), { localTask: null })
</script>
