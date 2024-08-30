<template>
	<div class="options-theme control-secondary">
		<template v-if="!showPalette">
			<div class="control">
				<div class="control-label">{{ $t('background') }}</div>
				<NColorPicker
					v-model:value="useReportStore().current.settings.theme.backgroundColor"
					:model="['hex']"
				/>
			</div>
			<div
				v-if="useReportStore().showOnlyIf(['combo'])"
				class="control"
			>
				<div class="control-label">{{ $t('color') }}: {{ $t('extra') }}</div>
				<NInput
					v-model:value="useReportStore().current.settings.extraColor"
					readonly
					:placeholder="$t('choose')"
				>
					<template #prepend>
						<span>
							<NColorPicker
								v-model:value="useReportStore().current.settings.extraColor"
								:models="['hex']"
							/>
						</span>
					</template>
				</NInput>
			</div>
			<div class="control">
				<div class="control-label">
					<div class="flex justify-between gap-2">
						<div>
							{{ $t('palette') }}
						</div>
						<div>
							<NTooltip
								:persistent="false"
								:show-after="1500"
							>
								<template #trigger>
									<NButton text>
										<template #icon>
											<g-icon
												name="add"
												@click="addColor()"
											/>
										</template>
									</NButton>
								</template>
								{{ $t('add') }}
							</NTooltip>
							<NTooltip
								:persistent="false"
								:show-after="1500"
							>
								<template #trigger>
									<NButton text>
										<template #icon>
											<g-icon
												name="palette"
												@click="showPalette = true"
											/>
										</template>
									</NButton>
								</template>
								{{ $t('palette') }}
							</NTooltip>
							<NTooltip
								:persistent="false"
								:show-after="1500"
							>
								<template #trigger>
									<NButton text>
										<template #icon>
											<g-icon
												name="save"
												@click="savePalette"
											/>
										</template>
									</NButton>
								</template>
								{{ $t('savePalette') }}
							</NTooltip>
						</div>
					</div>
				</div>
				<div v-if="useReportStore().current?.settings?.theme?.colors">
					<div
						v-for="(_, index) in useReportStore().current.settings.theme.colors"
						:key="index"
						class="control"
					>
						<div class="flex gap-2">
							<NColorPicker
								v-model:value="useReportStore().current.settings.theme.colors[index]"
								:show-alpha="false"
								class="grow"
							/>
							<NButton
								v-if="useReportStore().current.settings.theme.colors.length > 1"
								type="error"
								text
								@click="removeColor(index)"
							>
								<template #icon>
									<g-icon name="delete" />
								</template>
							</NButton>
						</div>
					</div>
				</div>
			</div>
		</template>
		<options-theme-palette
			v-else
			class="mt-2"
			@close="showPalette = false"
			@save="useReportStore().current.settings.theme = $event"
		/>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore, useReportStore } from '@/stores'
import OptionsThemePalette from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsThemePalette.vue'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const showPalette = ref(false)
const { t } = useI18n()
const message = useMessage()

const addColor = () => {
	useReportStore().current.settings.theme.colors.push('#2D65BA')
}
const savePalette = () => {
	const options = useAppStore().app.options || {}

	if (!options['palette']) {
		options['palette'] = []
	}

	options['palette'].unshift(useReportStore().current.settings.theme)

	useApi()
		.post('api/app/update-options', {
			body: {
				options: {
					...useAppStore().app.options
				},
				appId: useAppStore().app.appId
			}
		})
		.then(() => message.success(t('saved')))
}

const removeColor = (index: number) => {
	useReportStore().current.settings.theme.colors.splice(index, 1)
}
</script>
