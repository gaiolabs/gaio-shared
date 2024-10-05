<template>
	<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
		<NScrollbar style="max-height: calc(100vh - 72px)">
			<div class="flex items-center justify-between p-3 pb-0 pt-2 font-bold">
				<NCollapse>
					<NCollapseItem
						:title="$t('table')"
						name="3"
					>
						<GTableList
							v-model="useCodeDataStore().localTask.tables"
							class="pl-5 min-h-[10vh] max-h-[80vh]"
							multiple
						/>
					</NCollapseItem>
				</NCollapse>
			</div>
		</NScrollbar>
	</div>
</template>

<script setup lang="ts">
import GTableList from '@/components/table-list/GTableList.vue'
import { NScrollbar, NCollapse, NCollapseItem } from 'naive-ui'
import { useCodeDataStore } from '../store/useTaskStaticContentStore'
</script>
