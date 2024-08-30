<template>
	<div
		v-if="option.isLeaf && localParam"
		class="sidebar-param-label py-1"
	>
		<div class="control-label text-sm">
			{{ localParam.paramName }}
		</div>
		<NInput
			v-model:value="localParam.paramValue"
			size="tiny"
			@blur="updateParamValue"
		>
			<template
				v-if="localParam.paramName !== 'userId'"
				#suffix
			>
				<g-icon
					name="pencil"
					@click="$emit('edit', localParam)"
				/>
				<NPopconfirm
					:show-icon="false"
					:positive-button-props="{ type: 'error' }"
					:positive-text="$t('delete')"
					@positive-click="remove()"
				>
					<template #trigger>
						<g-icon name="delete" />
					</template>
					{{ $t('deletionConfirmation') }}
				</NPopconfirm>
			</template>
		</NInput>
	</div>
	<div v-else>
		{{ option.label }}
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import type { ParamType } from '@gaio/shared/types'
import type { TreeOption } from 'naive-ui'
import { onMounted, ref } from 'vue'

defineEmits(['edit'])
const props = defineProps<{ option: TreeOption }>()

const localParam = ref<Partial<ParamType>>()

const updateParamValue = () => {
	useAppStore().params = useAppStore().params.map((o) => {
		if (o.paramName === localParam.value.paramName) {
			o.value = localParam.value.value
		}
		return o
	})
}

const remove = () => {
	useAppStore().params = useAppStore().params.filter((o) => o.paramName !== localParam.value.paramName)
	useApi().post('api/app/update-params', {
		body: {
			params: useAppStore().params,
			appId: useAppStore().appInfo.appId
		}
	})
}

onMounted(() => {
	localParam.value = useAppStore().params.find((o) => o.paramName === props.option.key)
})
</script>
