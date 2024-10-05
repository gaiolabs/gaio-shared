<template>
	<div
		v-if="useReportStore().currentField"
		:key="useReportStore().currentField.id"
		class="options-field"
	>
		<NPageHeader @back="useReportStore().currentField = null">
			<template #subtitle>
				<div>
					<div class="text-lg text-prime">{{ useReportStore().currentField.columnName }}</div>
				</div>
			</template>
			<template #extra>
				<div>
					<NButton
						size="tiny"
						type="error"
						quaternary
						@click="removeField()"
					>
						<template #icon>
							<IconComponent name="Delete" />
						</template>
					</NButton>
				</div>
			</template>
		</NPageHeader>
		<!--        <div class="control-secondary flex items-center justify-between">-->
		<!--            <div>{{ useReportStore().currentField.columnName }}</div>-->
		<!--        </div>-->

		<NTabs
			class="mt-2"
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
						:default-expanded-names="['summarize']"
						arrow-placement="right"
					>
						<NCollapseItem name="general">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="general" />
									{{ $t('general') }}
								</div>
							</template>

							<div class="control-secondary">
								<div class="control">
									<div class="control-label">
										{{ $t('title') }}
									</div>
									<NInput
										v-model:value="useReportStore().currentField.title"
										:placeholder="$t('typeHere')"
									/>
								</div>
								<div class="control">
									<div class="label">
										{{ $t('alias') }} & {{ $t('parameter') }}
										<NSelect
											v-model:value="useReportStore().currentField.alias"
											filterable
											tag
											:placeholder="$t('alias')"
											:options="paramOptions"
										/>
									</div>
								</div>
								<div class="control">
									<NCheckbox
										v-model:checked="useReportStore().currentField.hidden"
										:label="$t('hideField')"
										class="w-full"
									/>
									<NCheckbox
										v-model:checked="useReportStore().currentField.html"
										:label="$t('htmlField')"
										class="w-full"
									/>
								</div>
							</div>
						</NCollapseItem>
						<NCollapseItem name="summarize">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="summarize" />
									{{ $t('summarize') }}
								</div>
							</template>
							<options-field-agg />
						</NCollapseItem>
						<NCollapseItem name="format">
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="formatValue" />
									{{ $t('format') }}
								</div>
							</template>
							<options-field-format />
						</NCollapseItem>
						<NCollapseItem
							:title="$t('link')"
							name="link"
						>
							<template #header>
								<div class="flex items-center gap-1">
									<g-icon name="link" />
									{{ $t('link') }}
								</div>
							</template>
							<options-field-link />
						</NCollapseItem>
					</NCollapse>
				</div>
			</NTabPane>
			<NTabPane
				name="style"
				:tab="$t('styles')"
			>
				<NCollapse arrow-placement="right">
					<NCollapseItem name="fontStyle">
						<template #header>
							<div class="flex items-center gap-1">
								<g-icon name="style" />
								{{ $t('fontStyle') }}
							</div>
						</template>
						<options-field-style />
					</NCollapseItem>
					<NCollapseItem name="dynamic">
						<template #header>
							<div class="flex items-center gap-1">
								<g-icon name="dynamic" />
								{{ $t('dynamic') }}
							</div>
						</template>
						<options-field-condition />
					</NCollapseItem>
				</NCollapse>
			</NTabPane>
		</NTabs>
	</div>
</template>

<script setup lang="ts">
import { useAppStore, useReportStore } from '@/stores'
import OptionsFieldAgg from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldAgg.vue'
import OptionsFieldCondition from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldCondition.vue'
import OptionsFieldFormat from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldFormat.vue'
import OptionsFieldLink from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldLink.vue'
import OptionsFieldStyle from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldStyle.vue'
import { NPageHeader } from 'naive-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const removeField = () => {
	useReportStore().current.schema.select = useReportStore().current.schema.select.filter(
		(o) => o.id !== useReportStore().currentField.id
	)
	useReportStore().currentField = null
}

const paramOptions = computed(() => {
	const noneList = [
		{
			value: '',
			label: t('none')
		}
	]

	const params = useAppStore().params.map((o) => {
		return {
			value: o.paramName,
			label: o.paramName
		}
	})

	return noneList.concat(params)
})
</script>
