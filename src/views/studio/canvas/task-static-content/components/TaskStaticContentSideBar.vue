<template>
	<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
		<NScrollbar style="max-height: calc(100vh - 72px)">
			<div class="flex items-center justify-between p-3 pb-0 pt-2 font-bold">
				<NCollapse>
					<NCollapseItem
						:title="$t('general')"
						name="1"
					>
						<NCheckboxGroup>
							<NCheckbox
								value="border"
								:label="$t('border')"
							/>
							<NCheckbox
								value="staticNeverRead"
								:label="$t('staticNeverRead')"
							/>
						</NCheckboxGroup>
					</NCollapseItem>
					<NCollapseItem
						:title="$t('components')"
						name="2"
					>
						<NButton></NButton>
					</NCollapseItem>
					<NCollapseItem
						:title="$t('table')"
						name="3"
					>
						<GSelectTable
							v-model="useCodeDataStore().localTask.tables"
							class="pl-5 h-[40vh]"
							multiple
							:is-list-format="true"
						/>
					</NCollapseItem>
					<NCollapseItem
						:title="$t('files')"
						name="4"
					></NCollapseItem>
				</NCollapse>
			</div>
		</NScrollbar>
	</div>
</template>

<script setup lang="ts">
import GSelectTable from '@/components/GSelectTable.vue'
import { NScrollbar, NButton, NCollapse, NCollapseItem, NCheckboxGroup, NCheckbox } from 'naive-ui'
import { useCodeDataStore } from '../store/useTaskStaticContentStore'
</script>
