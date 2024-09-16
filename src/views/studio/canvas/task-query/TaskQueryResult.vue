<template>
	<div class="task-query-result">
		<NTabs
			pane-class="bg-elevation-1"
			size="small"
			type="line"
			:default-value="currentTab"
		>
			<NTabPane
				v-for="(data, index) in result"
				:key="`#${index}`"
				:name="`tab-${index}`"
				:tab="`#${index}`"
				display-directive="show:lazy"
			>
				<NTable>
					<thead>
						<tr>
							<td
								v-for="col of generateColumns(data)"
								:key="col"
							>
								{{ col }}
							</td>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, index) of data"
							:key="index"
						>
							<td
								v-for="col of generateColumns(data)"
								:key="col"
							>
								{{ row[col] }}
							</td>
						</tr>
					</tbody>
				</NTable>
			</NTabPane>
		</NTabs>
	</div>
</template>
<script setup lang="ts">
import type { GenericType } from '@gaio/shared/types'
import { NTabPane } from 'naive-ui'

const { localTask = null, result = [] } = defineProps<{ localTask: GenericType; result: GenericType[] }>()

const generateColumns = (data: GenericType[]) => {
	return Object.keys(data[0])
}
</script>
