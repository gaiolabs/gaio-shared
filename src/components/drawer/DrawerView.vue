<template>
	<div
		class="fixed inset-0 w-svw h-svh drop-shadow-2xl flex flex-col justify-end transition-all duration-100 pointer-events-none"
		:class="isFullscreen ? '' : 'p-6 pb-8'"
	>
		<div
			id="DrawerBody"
			class="bg-white pointer-events-auto min-h-[420px] transition-all duration-[75ms] flex w-full flex-shrink flex-col overflow-hidden border-elevation-2"
			:class="isFullscreen ? 'h-screen' : 'shadow-2xl rounded-2xl h-[420px]'"
		>
			<header
				id="DrawerHeader"
				class="drawer-header flex justify-between p-2 px-3 border-b border-gray-200"
			>
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
										:name="isFullscreen ? 'panelBottom' : 'panelFull'"
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
			</header>
			<NScrollbar
				content-class="min-h-full flex"
				class="bg-gray-100 flex flex-col"
				style="max-height: 100%"
			>
				<slot
					name="content"
					class="min-h-full"
				/>
				<slot
					name="contentScroll"
					class="min-h-full"
				/>
			</NScrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { NButtonGroup, NTooltip, NButton, NScrollbar, NDivider } from 'naive-ui'
import { computed } from 'vue'
import GIcon from '../GIcon.vue'

defineEmits(['close'])
const props = defineProps({
	tag: {
		type: String,
		default: 'drawer-view'
	},
	onlyFullScreen: {
		type: Boolean,
		default: false
	}
})

const isFullscreen = computed(() => !!useAuthStore().user.options.studioDrawerFullscreen || props.onlyFullScreen)

const changeFullscreen = () => {
	useAuthStore().updateUserOptions({
		studioDrawerFullscreen: !isFullscreen.value
	})
}
</script>
