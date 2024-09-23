<!-- TODO: rename NucleoIcons to GIcon -->
<template>
	<template v-if="iconComponent">
		<component
			:is="iconComponent"
			v-bind="attrs"
			:strokewidth="1.25"
		/>
	</template>
	<template v-else>
		<WarningIcon
			title="Icon not found"
			class="text-yellow-400 rounded-full bg-red-700 p-1 w-7 h-7 animate-pulse"
		/>
	</template>
</template>

<script setup>
import WarningIcon from '@/components/icons/WarningIcon.vue'
import { computed, defineProps, useAttrs } from 'vue'

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
})

// Dynamically import all icons from the icons folder
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
