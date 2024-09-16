<template>
	<div class="task-query-result">
		<NTabs
			pane-class="bg-elevation-1"
			size="small"
			type="line"
			:default-value="currentTab"
		>
			<NTabPane
				v-for="(tab, index) in tabs"
				:key="`#${index}`"
				:name="`tab-${index}`"
				:tab="`#${index}`"
				display-directive="show:lazy"
			>
				{{ tab }}
			</NTabPane>
		</NTabs>
	</div>
</template>
<script setup lang="ts">
import { NTabPane } from 'naive-ui'

const { localTask = null, result = [] } = defineProps<{ localTask: GenericType; result: GenericType[] }>()
</script>
