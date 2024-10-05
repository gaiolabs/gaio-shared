<template>
	<g-dialog @close="$emit('close')">
		<template #title>
			{{ $t('parameter') }}
		</template>
		<template #content>
			<div class="sidebar-param-control">
				<div class="control">
					<div class="control-label">
						{{ $t('paramName') }}
						<sup>*</sup>
					</div>
					<NInput
						v-model:value="localParam.paramName"
						v-alpha
					/>
				</div>
				{{ isFunction }}
				<div class="control">
					<div class="control-label">
						{{ $t('description') }}
						<NInput
							v-model:value="localParam.paramDescription"
							type="textarea"
							rows="2"
						/>
					</div>
				</div>
				<div class="control">
					<div class="control-label">
						{{ $t('value') }}
						<NInput
							v-model:value="localParam.paramValue"
							:placeholder="$t('typeHere')"
						/>
					</div>
				</div>
				<div
					v-if="isFunction"
					class="control"
				>
					<NInputGroup>
						<NButton
							type="primary"
							@click="loadFunction()"
						>
							{{ $t('test') }}
						</NButton>
						<NInput
							v-model:value="testedValue"
							readonly
							:placeholder="$t('result')"
						/>
					</NInputGroup>
				</div>
			</div>
			<div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
				<NButton
					type="primary"
					@click="save"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import type { ParamType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

const message = useMessage()
const emit = defineEmits(['close', 'save'])
const props = defineProps<{
	param: ParamType
}>()

const localParam = ref<ParamType>()
const isFunction = computed(() => {
	return localParam.value.paramValue?.includes('{{')
})

const testedValue = ref('')
const reservedNames = ['userId', 'params', 'limit', 'offset', 'page']

const loadFunction = () => {
	useApi()
		.post('api/task/custom-param', {
			body: {
				params: [localParam.value]
			}
		})
		.then((res) => {
			testedValue.value = ''
			if (res[0]) {
				testedValue.value = res[0].paramValue || 'FUNCTION_ERROR'
			}
		})
}

const save = () => {
	if (reservedNames.includes(localParam.value.paramName)) {
		message.warning('reservedNames')
		return
	}

	if (!localParam.value.id) {
		useAppStore().params.push(localParam.value)
	} else {
		useAppStore().params = useAppStore().params.map((o) => {
			if (o.paramName === localParam.value.paramName) {
				return localParam.value
			}
			return o
		})
	}

	useApi().post('api/app/update-params', {
		body: {
			params: useAppStore().params,
			appId: useAppStore().appInfo.appId
		}
	})

	emit('save')
	emit('close')
}

onMounted(() => {
	localParam.value = cloneDeep(props.param)
})
</script>
