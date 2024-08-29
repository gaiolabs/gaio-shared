<template>
	<div
		v-if="useFormStore().current"
		class="task-form-setup-settings overflow-y-auto"
		style="height: calc(100vh - 100px)"
	>
		<div class="forms-settings control-secondary mt-2 px-2">
			<div class="control el-bold">
				ID: {{ useFormStore().current.formId }}
				<n-divider />
			</div>
			<div class="control">
				<div class="control-label">{{ $t('title') }}</div>
				<n-input v-model:value="useFormStore().current.formName" />
			</div>

			<div class="control">
				<div class="control-label">{{ $t('label') }}</div>
				<n-input v-model:value="useFormStore().current.formLabel" />
			</div>

			<div class="control">
				<div class="control-label">
					{{ $t('executionType') }}
				</div>
				<n-select
					v-model:value="useFormStore().current.formType"
					class="w-100"
					:options="[
						{ label: $t('openFlow'), value: 'openFlow' },
						{ label: $t('loadFlow'), value: 'loadFlow' }
					]"
				/>
			</div>
			<div class="control">
				<div class="control-label">{{ $t('flowToLoad') }}</div>
				<n-select
					v-model:value="useFormStore().current.flowId"
					filterable
					class="w-100"
					:options="flowList"
				/>
			</div>

			<!-- LOAD FLOW -->
			<div class="control mt-3">
				<n-button
					text
					type="primary"
					@click="showAdvanced = !showAdvanced"
				>
					<g-icon name="options" />
					{{ $t('advanced') }}
				</n-button>

				<div
					v-if="showAdvanced"
					class="control-secondary px-2"
				>
					<div class="control control-settings">
						<div
							v-if="useFormStore().current.formType === 'loadFlow'"
							class="control"
						>
							<n-checkbox
								v-model:checked="useFormStore().current.formReload"
								:label="$t('reloadCurrentFlow')"
							/>
						</div>
						<div class="control">
							<n-checkbox
								v-model:checked="useFormStore().current.formResetParams"
								:label="$t('resetParamAfterFlow')"
							/>
						</div>
						<div class="control">
							<n-checkbox
								v-model:checked="useFormStore().current.formConfirm"
								:label="$t('confirmBeforeLoad')"
							/>
						</div>
					</div>
					<div
						v-if="useFormStore().current.formConfirm"
						class="control"
					>
						<div class="control-label">
							{{ $t('messageOnConfirm') }}
						</div>
						<n-input v-model:value="useFormStore().current.formConfirmDescription" />
					</div>
					<div
						v-if="useFormStore().current.formType === 'loadFlow'"
						class="control"
					>
						<div class="control-label">
							{{ $t('messageOnError') }}
						</div>
						<n-input v-model:value="useFormStore().current.formOnError" />
					</div>
					<div
						v-if="useFormStore().current.formType === 'loadFlow'"
						class="control"
					>
						<div class="control-label">
							{{ $t('messageOnSuccess') }}
						</div>
						<n-input v-model:value="useFormStore().current.formOnSuccess" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useAppStore, useFormStore } from '@/stores'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showAdvanced = ref(false)

const flowList = computed(() => {
	return [
		{
			label: t('none'),
			value: ''
		}
	].concat(
		useAppStore().flowList.map((flow) => ({
			label: flow.flowName,
			value: flow.flowId
		}))
	)
})
</script>
