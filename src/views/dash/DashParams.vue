<template>
	<div class="dash-params">
		<n-drawer
			:show="showParameters"
			:width="400"
			@update:show="$emit('close')"
		>
			<n-drawer-content
				closable
				:title="$t('parameters')"
				body-class="!p-1 !m-0"
				body-content-class="!p-1 !m-0"
			>
				<n-table
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
									<n-input
										v-model:value="item.paramValue"
										readonly
										size="tiny"
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</n-table>
			</n-drawer-content>
		</n-drawer>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
defineProps<{
	showParameters: boolean
}>()
defineEmits(['close'])
</script>
