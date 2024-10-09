<template>
	<div
		class="drawer absolute"
		:class="mainWrapper"
	>
		<div
			class="drawer-body flex w-full flex-shrink flex-col overflow-hidden border-elevation-2"
			:class="secondWrapper"
		>
			<div class="drawer-header flex justify-between p-2 px-3">
				<slot name="header" />
				<div class="flex items-center justify-end gap-2">
					<slot name="actions" />
					<div class="flex items-center gap-1">
						<NButtonGroup>
							<NButton
								v-if="!onlyFullScreen"
								size="tiny"
								quaternary
								@click="changeFullscreen()"
							>
								<template #icon>
									<GIcon
										:name="fullscreen ? 'panelBottom' : 'panelFull'"
										color="gray"
									/>
								</template>
							</NButton>
						</NButtonGroup>
						<NDivider
							v-if="!onlyFullScreen"
							vertical
						/>
						<NTooltip :show-after="1500">
							<template #trigger>
								<NButton
									size="tiny"
									tertiary
									type="error"
									@click="$emit('close')"
								>
									<template #icon>
										<GIcon name="close" />
									</template>
								</NButton>
							</template>
							{{ $t('close') }}
						</NTooltip>
					</div>
				</div>
			</div>
			<div
				v-if="slots.content"
				class="drawer-content grow"
			>
				<NScrollbar :style="scrollStyle">
					<slot
						name="content"
						:min-height="scrollHeight"
					/>
				</NScrollbar>
			</div>

			<div
				v-if="slots.contentScroll"
				class="drawer-content-scroll grow"
			>
				<NScrollbar :style="scrollStyle">
					<slot name="contentScroll"></slot>
				</NScrollbar>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import { NButtonGroup, NTooltip, NButton, NScrollbar, NDivider } from 'naive-ui'
import { computed, useSlots } from 'vue'
import GIcon from '../GIcon.vue'

const slots = useSlots()
const windowSize = useWindowSize()

defineEmits(['close'])
const props = defineProps({
	tag: {
		type: String,
		default: 'drawer-view',
	},
	onlyFullScreen: {
		type: Boolean,
		default: false,
	},
})

const scrollStyle = computed(() => `height: ${scrollHeight.value} !important`)

const fullscreen = computed(() => !!useAuthStore().user.options.studioDrawerFullscreen || props.onlyFullScreen)

const scrollHeight = computed(() => {
	if (fullscreen.value) {
		return `${windowSize.height.value - 44}px `
	}
	return '386px'
})

const changeFullscreen = () => {
	useAuthStore().updateUserOptions({
		studioDrawerFullscreen: !fullscreen.value,
	})
}

const mainWrapper = computed(() => {
	if (fullscreen.value) {
		return ' left-0 right-0 bottom-0 top-0 z-10 p-0 m-0'
	}
	return ' left-0 right-0 bottom-[30px]  pt-0 z-10 p-[10px] py-[5px] flex flex-col justify-end'
})

const secondWrapper = computed(() => {
	if (fullscreen.value) {
		return 'h-full rounded-0'
	}

	return 'h-[430px] rounded-[10px]'
})
</script>

<style lang="scss">
.drawer {
	.drawer-body {
		box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.12);
	}

	.n-scrollbar .n-scrollbar-container .n-scrollbar-content {
		min-height: v-bind(scrollHeight);
	}
}

.light {
	.drawer {
		.drawer-body {
			background: var(--elevation-1);

			.drawer-header {
				background: var(--elevation-0);
				border-bottom: 1px solid var(--elevation-2);
			}
		}
	}
}

.dark {
	.drawer {
		.drawer-body {
			background: var(--elevation-1);

			.drawer-header {
				background: var(--elevation-0);
				border-bottom: 1px solid var(--elevation-2);
			}
		}
	}
}
</style>
