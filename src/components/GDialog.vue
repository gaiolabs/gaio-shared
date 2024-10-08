<template>
	<NModal
		id="g-dialog"
		ref="rootRef"
		v-model:show="showModal"
		destroy-on-close
		:mask-closable="false"
		class="!rounded-3xl"
		@update:show="closeModal"
	>
		<GCard
			id="g-dialog-wrapper"
			:type="isDark ? 'base' : 'wrapper'"
			class="my-3 p-2 w-[98%] min-w-[380px] rounded-[8px] sm:w-[95%] md:w-[80%] lg:w-[70%] xl:w-[55%]"
			:class="dialogSize"
			:style="{ width: props.width }"
		>
			<header class="flex min-h-[42px] items-center justify-between gap-2 rounded-t-[6px] p-2 pt-0">
				<div class="flex grow items-center text-lg font-semibold">
					<slot name="title"></slot>
				</div>
				<div class="flex items-end">
					<GButton
						type="secondary"
						square
						@click="closeModal()"
					>
						<template #icon>
							<IconComponent
								class="size-5"
								name="Close"
							/>
						</template>
					</GButton>
				</div>
			</header>

			<GCard
				v-if="$slots.content"
				:type="isDark ? 'wrapper' : 'base'"
				class="rounded-2xl"
				opaque
			>
				<slot name="content"></slot>
			</GCard>
			<GCard
				v-if="$slots.tabs"
				:type="isDark ? 'wrapper' : 'base'"
				class="rounded-2xl"
				opaque
			>
				<slot name="tabs"></slot>
			</GCard>
			<footer
				v-if="$slots.footer"
				class="mt-2 px-2"
			>
				<slot name="footer"></slot>
			</footer>
		</GCard>
	</NModal>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import GButton from '@/components/inputs/GButton.vue'
import { useDark } from '@vueuse/core'
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
const isDark = useDark()

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
#g-dialog {
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
