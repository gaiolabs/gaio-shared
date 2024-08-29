<template>
	<div
		v-if="localTask"
		class="task-rest-headers flex size-full flex-col gap-4 p-4"
	>
		<div class="flex flex-col gap-1">
			<label
				class="control-label"
				for="rows"
			>
				{{ $t('timeout') }}
			</label>
			<n-input-number id="rows" />
			<p class="text-xs text-gray-500">{{ $t('rowInfo') }}</p>
		</div>
		<div class="divider h-[1px] w-full bg-gray-300" />
		<div class="flex w-full justify-between">
			<div class="flex gap-1">
				<g-icon name="info" />
				<p class="text-gray-500">{{ $t('headersInfo') }}</p>
			</div>
			<n-button @click="addProperty">
				<template #icon>
					<g-icon name="plus" />
				</template>
				{{ $t('addProperty') }}
			</n-button>
		</div>
		<div class="relative w-full overflow-auto">
			<table class="text-md w-full caption-bottom rounded-md border">
				<thead class="[&_tr]:border-b">
					<tr class="border-b transition-colors">
						<th class="h-12 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0">
							{{ $t('property') }}
						</th>
						<th class="h-12 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0">
							{{ $t('value') }}
						</th>
					</tr>
				</thead>
				<tbody class="[&_tr:last-child]:border-0">
					<tr
						v-for="(header, index) of localTask.headers"
						:key="index"
					>
						<td class="p-2 align-middle [&:has([role=checkbox])]:pr-0">
							<n-input v-model:value="header.prop" />
						</td>
						<td class="p-2 align-middle [&:has([role=checkbox])]:pr-0">
							<div class="flex gap-1">
								<n-input v-model:value="header.value" />
								<n-button
									size="tiny"
									text
									type="error"
									@click="removeProperty(index)"
								>
									<template #icon>
										<g-icon name="delete" />
									</template>
								</n-button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'

const props = withDefaults(defineProps<{ localTask: RestTaskType }>(), { localTask: null })

const addProperty = () => {
	props.localTask.headers.push({ prop: '', value: '' })
}

const removeProperty = (index: number) => {
	props.localTask.headers = props.localTask.headers.filter((_, i) => {
		return i !== index
	})
}
</script>
