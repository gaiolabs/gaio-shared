<template>
	<div class="dash-grid-options mt-[60px] w-full px-3">
		<div class="g-card flex w-full items-center justify-between p-2">
			<div class="flex items-center justify-center">
				<div>
					<IconComponent class="rotate-[-90deg]" name="studio" />
					{{ useAppStore().flow.flowName }}
				</div>
			</div>
			<div class="flex items-center justify-center gap-3">
				<NButton
					tertiary
					size="tiny"
					@click="gridOptions.editGrid = !gridOptions.editGrid"
				>
					<template #icon>
						<g-icon name="resize" />
					</template>
				</NButton>
				<NDivider vertical />
				<NButton
					secondary
					size="tiny"
					@click="changeLayoutSize('lg')"
				>
					<template #icon>
						<g-icon name="desktop" />
					</template>
				</NButton>
				<NButton
					secondary
					size="tiny"
					@click="changeLayoutSize('md')"
				>
					<template #icon>
						<g-icon name="tablet" />
					</template>
				</NButton>
				<NButton
					secondary
					size="tiny"
					@click="changeLayoutSize('sm')"
				>
					<template #icon>
						<g-icon name="mobile" />
					</template>
				</NButton>

				<NDivider vertical />
				<NButton
					tertiary
					@click="showLayoutHideOption = true"
				>
					<template #icon>
						<IconComponent name="Eye" />
					</template>
					{{ $t('visibility') }}
				</NButton>
			</div>
		</div>

		<g-dialog
			v-if="showLayoutHideOption"
			@close="showLayoutHideOption = false"
		>
			<template #title>
				{{ $t('visibility') }}
			</template>
			<template #content>
				<div>
					<NInput
						v-model:value="searchTerm"
						:placeholder="$t('filter')"
						clearable
						class="mb-2"
					/>
					<g-alert :title="$t('reportVisibility')" />
					<div class="mt-2">
						<div class="grid grid-cols-4 gap-4">
							<div
								v-for="item of filterBy(reportNodes, 'label', searchTerm)"
								:key="item.id"
								class="g-card p-2"
							>
								<div class="flex w-full flex-col">
									<div class="flex-between flex w-full flex-grow">
										<div class="flex-grow">{{ item.label }}</div>
										<div>
											<NSwitch
												:key="item.id"
												v-model:value="item.hidden"
												size="small"
												@update:value="changeVisibility(item)"
											/>
										</div>
									</div>
									<div>
										{{ item.type }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</g-dialog>
	</div>
</template>

<script setup lang="ts">
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { GridOptionsType } from '@/views/dash/DashTypes'
import type { NodeType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { ref } from 'vue'

const props = defineProps<{
	gridOptions: GridOptionsType
}>()

const { filterBy } = useHelper()

const searchTerm = ref('')
const showLayoutHideOption = ref(false)
const reportNodes = ref(useAppStore().flow.workflow.nodes.filter((node) => node.type === 'report'))

const changeVisibility = (item: NodeType) => {
	useAppStore().flow.workflow.nodes.forEach((o) => {
		if (o.id === item.id) {
			o.layout = o.layout || {}
			o.layout[props.gridOptions.currentLayout] = o.layout[props.gridOptions.currentLayout] || {}
			o.layout[props.gridOptions.currentLayout].hidden = item.hidden
		}
	})
	props.gridOptions.refreshLayoutKey = getId()

	useAppStore().saveFlow()
}

const changeLayoutSize = (size: 'lg' | 'md' | 'sm') => {
	props.gridOptions.currentLayout = size
	if (size === 'lg') {
		props.gridOptions.viewPortSize = {
			width: '100%',
			border: '2px solid #e6e6e6',
			margin: '10px 0 0'
		}
	} else if (size === 'md') {
		props.gridOptions.viewPortSize = {
			width: '773px',
			border: '2px solid #e6e6e6',
			margin: '10px 0 0'
		}
	} else if (size === 'sm') {
		props.gridOptions.viewPortSize = {
			width: '485px',

			border: '2px solid #e6e6e6',
			margin: '10px 0 0'
		}
	}
}
</script>
