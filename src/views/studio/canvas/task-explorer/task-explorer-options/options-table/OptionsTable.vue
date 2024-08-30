<template>
	<div class="options-table p-2 px-1">
		<NTabs
			type="segment"
			animated
			size="small"
		>
			<NTabPane
				name="properties"
				:tab="$t('properties')"
			>
				<div class="px-1">
					<NCollapse
						accordion
						arrow-placement="right"
					>
						<NCollapseItem name="general">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="general" />
									{{ $t('general') }}
								</div>
							</template>
							<options-table-general />
						</NCollapseItem>
						<NCollapseItem
							:title="$t('title')"
							name="title"
						>
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="cardTitle" />
									{{ $t('title') }}
								</div>
							</template>
							<options-title />
						</NCollapseItem>
						<NCollapseItem name="forms">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="formOption" />
									{{ $t('forms') }}
								</div>
							</template>
							<options-forms />
						</NCollapseItem>
						<NCollapseItem name="rowsPerPage">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="rowsPerPage" />
									{{ $t('rowsPerPage') }}
								</div>
							</template>
							<options-rows-per-page />
						</NCollapseItem>
						<NCollapseItem
							:title="$t('filters')"
							name="filters"
						>
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="filterCheck" />
									{{ $t('filters') }}
								</div>
							</template>
							<options-table-filters />
						</NCollapseItem>
						<NCollapseItem
							:title="$t('download')"
							name="download"
						>
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="downloadFile" />
									{{ $t('download') }}
								</div>
							</template>
							<options-download />
						</NCollapseItem>
						<NCollapseItem name="message">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="info" />
									{{ $t('message') }}
								</div>
							</template>
							<options-message />
						</NCollapseItem>
					</NCollapse>
				</div>
			</NTabPane>
			<NTabPane
				name="style"
				:tab="$t('styles')"
			>
				<div class="px-1">
					<NCollapse
						:default-expanded-names="['personalize']"
						arrow-placement="right"
					>
						<NCollapseItem
							:title="$t('personalize')"
							name="personalize"
						>
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="style" />
									{{ $t('personalize') }}
								</div>
							</template>

							<div>
								<div class="control-secondary w-full">
									<NCheckbox
										v-model:checked="useReportStore().current.settings.headerBackgroundDark"
										:label="$t('headerBackgroundDark')"
									/>
								</div>
								<div class="control-secondary w-full">
									<NCheckbox
										v-model:checked="useReportStore().current.settings.tableStriped"
										:label="$t('tableStriped')"
										class="w-full"
									/>
									<!--                                    <NCheckbox-->
									<!--                                        v-model:checked="useReportStore().current.settings.tableHover"-->
									<!--                                        :label="$t('tableHover')"-->
									<!--                                        class="w-full"-->
									<!--                                    />-->
									<NCheckbox
										v-model:checked="useReportStore().current.settings.tableSm"
										:label="$t('tableSm')"
										class="w-full"
									/>
									<NCheckbox
										v-model:checked="useReportStore().current.settings.tableBordered"
										:label="$t('tableBordered')"
										class="w-full"
									/>
									<NCheckbox
										v-model:checked="useReportStore().current.settings.tableSingleColumn"
										:label="$t('tableSingleColumn')"
										class="w-full"
									/>
									<NCheckbox
										v-model:checked="useReportStore().current.settings.tableSingleLine"
										:label="$t('tableSingleLine')"
										class="w-full"
									/>
								</div>
							</div>
						</NCollapseItem>
					</NCollapse>
				</div>
			</NTabPane>
		</NTabs>
	</div>
</template>
/template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import OptionsDownload from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsDownload.vue'
import OptionsForms from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsForms.vue'
import OptionsMessage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsMessage.vue'
import OptionsRowsPerPage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsRowsPerPage.vue'
import OptionsTitle from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsTitle.vue'
import OptionsTableFilters from '@/views/studio/canvas/task-explorer/task-explorer-options/options-table/OptionsTableFilters.vue'
import OptionsTableGeneral from '@/views/studio/canvas/task-explorer/task-explorer-options/options-table/OptionsTableGeneral.vue'
</script>

<style lang="scss">
.n-collapse-item-arrow {
	display: none;
}
</style>
