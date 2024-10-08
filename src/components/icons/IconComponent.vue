<template>
	<template v-if="iconComponent">
		<component
			:is="iconComponent"
			class="icon"
			v-bind="attrs"
			:strokewidth="1.25"
		/>
	</template>
	<template v-else>
		<div class="absolute rotate-[-90deg]">
			<div class="rotate-90 absolute left-0 top-0 translate-x-[-50%] translate-y-[-50%]">
				<div class="bg-red-700 text-yellow-400 p-1 rounded-full relative z-20">
					<WarningIcon
						:id="props.name"
						title="Icon not found"
						class="w-7 h-7"
					/>
				</div>
				<div class="absolute bg-red-700 inset-0 rounded-full z-10 animate-ping"></div>
			</div>
			<div
				class="bg-red-900 animate-rubber-band text-yellow-300 px-1 py-0.5 text-xs absolute left-12 top-0 translate-x-[-50%] translate-y-[-50%]"
			>
				{{ props.name }}
			</div>
		</div>
	</template>
</template>

<script lang="ts" setup>
import WarningIcon from '@/components/icons/WarningIcon.vue'
import { computed, useAttrs } from 'vue'

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
})

// @ts-expect-error Yes, glob does exists in meta! Don't know why it says it doesn't
const iconModules = import.meta.glob('./*.vue', { eager: true })

const attrs = useAttrs()

const iconComponent = computed(() => {
	const componentPath = `./${props.name}Icon.vue`
	const component = iconModules[componentPath]

	if (!component) {
		return undefined
	}

	return component.default || component
})
</script>

<style scoped>
.icon {
	@apply transition-all duration-300 ease-in-out;
}
</style>
