<template>
	<n-modal
		ref="rootRef"
		v-model:show="showModal"
		class="dash-dialog"
		destroy-on-close
		:mask-closable="false"
		@close="closeModal"
	>
		<div :style="dialogSize">
			<div
				class="flex min-h-[42px] items-center justify-between gap-2 rounded-t-[6px] bg-paper-100 px-4 py-2 dark:bg-carbon-100"
				:style="dialogSize"
			>
				<div class="flex grow items-center">
					<slot name="title"></slot>
				</div>
				<div class="flex items-end">
					<n-button
						secondary
						size="tiny"
						@click="closeModal()"
					>
						<template #icon>
							<g-icon name="close" />
						</template>
					</n-button>
				</div>
			</div>
			<div>
				<slot name="content"></slot>
			</div>
		</div>
	</n-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({
	width: {
		type: String,
		default: () => undefined
	}
})

const dialogSize = computed(() => {
	if (props.width) {
		return {
			width: `${props.width}%`
		}
	}
	return {
		width: '100vh'
	}
})

const showModal = ref(true)
const closeModal = () => emit('close')
</script>
