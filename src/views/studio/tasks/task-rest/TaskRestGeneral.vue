<template>
	<div
		v-if="localTask"
		class="task-rest-general flex size-full flex-col gap-6"
	>
		<div class="flex w-full gap-1">
			<div class="w-full">
				<label
					class="control-label"
					for="endpoint"
				>
					{{ $t('endpoint') }}
				</label>
				<NInput
					id="endpoint"
					v-model:value="localTask.url"
				/>
			</div>
			<div class="w-[180px]">
				<label
					class="control-label"
					for="method"
				>
					{{ $t('method') }}
				</label>
				<NSelect
					id="method"
					v-model:value="localTask.method"
					:options="restMethods"
				/>
			</div>
			<!--            <div class="w-1/2">-->
			<!--                <label-->
			<!--                    class="control-label"-->
			<!--                    for="times"-->
			<!--                >-->
			<!--                    {{ $t('times') }}-->
			<!--                </label>-->
			<!--                <NInputNumber-->
			<!--                    id="times"-->
			<!--                    v-model:value="times"-->
			<!--                />-->
			<!--            </div>-->
			<div class="flex grow items-end">
				<NButton @click="runTest">
					{{ $t('runTest') }}
				</NButton>
			</div>
		</div>
		<GAlert title="You can use parameters in the URL. Ex.: https://restsite.com/?field={\{param}\}" />
	</div>
</template>
<script setup lang="ts">
import GAlert from '@/components/GAlert.vue'
import useApi from '@/composables/useApi'
import type { RestTaskType } from '@gaio/shared/types'
import { NAlert } from 'naive-ui'
import { ref } from 'vue'

// const times = ref(1)

async function runTest() {
	// until we use it
	await useApi().post('api/task/test-rest', {
		body: {
			url: localTask.url,
			method: localTask.method,
			data: localTask.body,
			headers: Object.fromEntries(localTask.headers.map(({ prop, value }) => [prop, value])),
		},
	})
}

const restMethods = ref([
	{
		label: 'GET',
		value: 'GET',
	},
	{
		label: 'POST',
		value: 'POST',
	},
	{
		label: 'PUT',
		value: 'PUT',
	},
	{
		label: 'DELETE',
		value: 'DELETE',
	},
])

const { localTask = null } = defineProps<{ localTask: RestTaskType }>()
</script>
