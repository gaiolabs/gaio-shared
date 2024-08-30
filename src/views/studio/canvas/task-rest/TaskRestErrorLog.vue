<template>
	<div
		v-if="localTask"
		class="task-rest-error-log flex max-h-[526px] flex-col gap-6 p-6"
	>
		<div class="flex w-full items-center gap-2">
			<div class="control w-full">
				<label class="control-label">{{ $t('logTable') }}</label>
				<div class="flex w-full gap-1">
					<NButton>{{ $t('log') }}</NButton>
					<n-input
						v-model:value="localTask.keepLogTable"
						placeholder="Enable Value"
					/>
				</div>
			</div>
			<div
				v-if="localTask.keepLogTable !== ''"
				class="control"
			>
				<label class="control-label">{{ $t('keepLogDays') }}</label>
				<n-input-number
					v-model:value="localTask.keepLogDays"
					:min="0"
					:step="1"
				/>
			</div>
		</div>
		<div v-if="localTask.keepLogTable !== ''">
			<g-select-column
				v-model="localTask.keepLogTableExtraColumn"
				:table-name="localTask?.tableName"
				multiple
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'

const { localTask } = withDefaults(defineProps<{ localTask: RestTaskType }>(), {
	localTask: null
})
</script>
