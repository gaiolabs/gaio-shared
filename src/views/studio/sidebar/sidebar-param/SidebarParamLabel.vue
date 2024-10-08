<template>
	<div
		v-if="option.isLeaf && localParam"
		:key="`${isRefreshing}`"
		class="sidebar-param-label py-1"
	>
		<div class="control-label text-sm">
			{{ localParam.paramName }}
		</div>

		<!-- TODO: On input change, save button needs to turn into primary -->
		<NInput
			v-model:value="localParam.paramValue"
			size="tiny"
			@blur="updateParamValue"
		>
			<template
				v-if="localParam.paramName !== 'userId'"
				#suffix
			>
				<IconComponent
					name="Edit"
					class="cursor-pointer hover:opacity-70"
					@click="$emit('edit', localParam)"
				/>

				<NPopconfirm
					:show-icon="false"
					:positive-button-props="{ type: 'error' }"
					:positive-text="$t('delete')"
					@positive-click="remove()"
				>
					<template #trigger>
						<IconComponent
							name="Delete"
							class="cursor-pointer hover:opacity-70"
						/>
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
const { option, isRefreshing } = defineProps<{ isRefreshing: boolean; option: TreeOption }>()

const localParam = ref<Partial<ParamType>>()

watch(
	() => isRefreshing,
	() => {
		setLocalParam()
	},
)

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
			appId: useAppStore().appInfo.appId,
		},
	})
}

const setLocalParam = () => (localParam.value = useAppStore().params.find((o) => o.paramName === option.key))

onMounted(() => {
	setLocalParam()
})
</script>
