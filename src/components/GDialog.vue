<template>
	<NModal
		ref="rootRef"
		v-model:show="showModal"
		class="g-modal"
		destroy-on-close
		:mask-closable="false"
		@update:show="closeModal"
	>
		<div
			class="g-modal-wrapper my-3 w-[98%] min-w-[380px] rounded-[8px] sm:w-[95%] md:w-[80%] lg:w-[70%] xl:w-[55%]"
			:class="dialogSize"
			:style="{ width: props.width }"
		>
			<div
				class="flex min-h-[42px] items-center justify-between gap-2 rounded-t-[6px] bg-paper-100 px-4 py-2 dark:bg-carbon-100"
			>
				<div class="flex grow items-center">
					<slot name="title"></slot>
				</div>
				<div class="flex items-end">
					<NButton
						secondary
						size="tiny"
						@click="closeModal()"
					>
						<template #icon>
							<IconComponent name="Close" />
						</template>
					</NButton>
				</div>
			</div>
			<div class="overflow-hidden rounded-b-[6px]">
				<div
					v-if="$slots.content"
					class="g-bg-300 p-4"
				>
					<slot name="content"></slot>
				</div>
				<div
					v-if="$slots.tabs"
					class="g-bg-1 mx-[-5px] mt-[-10px]"
				>
					<slot name="tabs"></slot>
				</div>
				<div
					v-if="$slots.footer"
					class="g-bg-100 border border-paper-300 px-4 py-2 dark:border-carbon-300"
				>
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</NModal>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({
	width: {
		type: String,
		default: () => undefined,
	},
})

const dialogSize = computed(() => {
	if (!props.width) {
		return ' w-[98%] min-w-[380px]  sm:w-[95%] md:w-[80%] lg:w-[70%] xl:w-[55%]'
	}
	return ''
})

const showModal = ref(true)

const closeModal = () => {
	// showModal.value = false
	// Unmount the component
	emit('close')
}

onMounted(() => {
	showModal.value = true
})
</script>
<style lang="scss">
.g-modal {
	border-radius: 6px;
	max-height: calc(100vh - 100px) !important;

	.n-tabs {
		margin-top: 10px;
		.v-x-scroll {
			padding: 0 18px;
			border-bottom: 1px solid var(--n-tab-border-color);
		}

		.n-tabs-nav-scroll-content {
			border-bottom-color: transparent !important;
		}

		&.inner-tabs {
			margin-top: initial;
			.v-x-scroll {
				padding: initial; // Reset or no style
				border-bottom: initial; // Reset or no style
			}

			.n-tabs-nav-scroll-content {
				border-bottom: 1px solid var(--n-tab-border-color);
			}
		}
	}

	//.n-tabs-nav-scroll-content {
	//    &:first-child {
	//        margin: 0 18px;
	//    }
	//}

	.n-tabs .n-tabs-nav,
	.n-tabs-nav-scroll-wrapper {
		//background: var(--elevation-0);
	}
}
</style>
