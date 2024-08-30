<template>
	<div class="dash-params">
		<NDrawer
			:show="showParameters"
			:width="400"
			@update:show="$emit('close')"
		>
			<NDrawerContent
				closable
				:title="$t('parameters')"
				body-class="!p-1 !m-0"
				body-content-class="!p-1 !m-0"
			>
				<NTable
					size="small"
					striped
					:bordered="false"
					:bottom-bordered="false"
				>
					<tbody>
						<tr
							v-for="item of useAppStore().params"
							:key="item.paramName"
						>
							<td>
								<div>{{ item.paramName }}</div>
								<div>
									<NInput
										v-model:value="item.paramValue"
										readonly
										size="tiny"
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</NTable>
			</NDrawerContent>
		</NDrawer>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
import { NDrawer, NDrawerContent, NTable } from 'naive-ui'
defineProps<{
	showParameters: boolean
}>()
defineEmits(['close'])
</script>
