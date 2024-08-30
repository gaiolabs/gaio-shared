<template>
	<g-dialog @close="$emit('close')">
		<template #title>{{ $t('taskForm') }}</template>
		<template #content>
			<div v-if="localTask">
				<div
					v-if="!showFormPreview"
					class="task-sample overflow-auto"
				>
					<div class="control">
						<div class="control-label">{{ $t('label') }}</div>
						<NInput v-model:value="localTask.label" />
					</div>

					<div class="control">
						<div class="control-label">{{ $t('formName') }}</div>
						<div class="flex items-center justify-between gap-2">
							<div class="grow">
								<g-select-form v-model="localTask.formId" />
							</div>
							<div v-if="localTask.formId">
								<NButton-group>
									<NButton
										type="primary"
										@click="showFormPreview = !showFormPreview"
									>
										<g-icon name="eye" />
									</NButton>
									<NButton
										type="primary"
										@click="editForm"
									>
										<g-icon name="edit" />
									</NButton>
								</NButton-group>
							</div>
						</div>
					</div>

					<div class="control-label">
						{{ $t('formOnDash') }}
					</div>
					<NCard content-style="padding:10px">
						<div class="control">
							<NRadioGroup
								v-model:value="localTask.formLoadType"
								@update:value="prepareCardEvent()"
							>
								<NRadio
									:label="$t('buttonOnDashboard')"
									value="button"
									class="w-full"
								/>
								<NRadio
									:label="$t('cardOnDashboard')"
									value="card"
									class="w-full"
								/>
								<NRadio
									:label="$t('formSidebarAside')"
									value="aside"
									class="w-full"
								/>
							</NRadioGroup>
						</div>
					</NCard>
					<div
						v-if="localTask.formLoadType !== 'button'"
						class="control mx-1 mt-2"
					>
						<NCheckbox
							v-model:checked="localTask.formFilterBehavior"
							:label="$t('formFilterBehavior')"
							class="w-full"
						/>
					</div>
					<NDivider />
					<div class="control-label mt-2">{{ $t('style') }}</div>
					<div class="control-secondary mb-3 p-2">
						<div class="flex gap-1">
							<div class="control grow">
								<div class="control-label">
									{{ $t('buttonTitle') }}
								</div>
								<NInput
									v-model:value="localTask.buttonTitle"
									size="small"
								/>
							</div>

							<div class="control grow">
								<div class="control-label">{{ $t('size') }}</div>
								<NSelect
									v-model:value="localTask.buttonSize"
									size="small"
									:options="[
										{ label: $t('large'), value: 'large' },
										{ label: $t('small'), value: 'small' }
									]"
								/>
							</div>
						</div>

						<div class="control">
							<div class="control-label">
								{{ $t('buttonTheme') }}
							</div>
							<NColorPicker
								v-model:value="localTask.buttonTheme"
								:modes="['hex']"
							/>
						</div>

						<div class="control">
							<div class="control-label">
								{{ $t('buttonPreview') }}
							</div>
							<div class="preview">
								<NTooltip :show-after="1500">
									<template #trigger>
										<NButton
											class="w-100"
											:color="localTask.buttonTheme"
											:size="localTask.buttonSize"
											style="color: white"
										>
											{{ localTask.buttonTitle ? localTask.buttonTitle : $t('preview') }}
										</NButton>
									</template>
									<div>
										{{ $t('preview') }}
									</div>
								</NTooltip>
							</div>
						</div>
					</div>
				</div>

				<!--            <div v-if="showFormPreview">-->
				<!--                <n-page-header-->
				<!--                    :title="$t('back')"-->
				<!--                    @back="showFormPreview = false"-->
				<!--                />-->
				<!--                preview here, add later-->
				<!--            </div>-->
				<div class="flex justify-end">
					<NButton
						type="primary"
						@click="save()"
					>
						{{ $t('save') }}
					</NButton>
				</div>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore, useFormStore } from '@/stores'
import type { FormCardType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['choose', 'close'])

const localTask = ref<FormCardType>()
const showFormPreview = ref(false)

const editForm = () => {
	useFormStore().current = useAppStore().forms.find((o) => o.formId === localTask.value.formId)
	emit('choose', { type: 'form' })
}

const prepareCardEvent = () => {
	if (localTask.value.formLoadType === 'button') {
		localTask.value.formFilterBehavior = false
	}
}

const save = () => {
	const taskToBeSaved = localTask.value

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: taskToBeSaved,
			sources: [],
			targets: []
		})
		.save()
		.then(() => emit('close'))
}

const adjustButtonThemeColor = () => {
	if (localTask.value.buttonTheme === 'primary') {
		localTask.value.buttonTheme = '#182EAB'
	} else if (localTask.value.buttonTheme === 'danger') {
		localTask.value.buttonTheme = '#e32'
	} else if (localTask.value.buttonTheme === 'success') {
		localTask.value.buttonTheme = '#2e8d2e'
	} else if (localTask.value.buttonTheme === 'warning') {
		localTask.value.buttonTheme = '#f4c20d'
	} else if (localTask.value.buttonTheme === 'info') {
		localTask.value.buttonTheme = '#2e8d2e'
	} else {
		localTask.value.buttonTheme = localTask.value.buttonTheme || '#182EAB'
	}
}

onMounted(() => {
	localTask.value = useDefault({
		type: 'form',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})

	adjustButtonThemeColor()
})
</script>
