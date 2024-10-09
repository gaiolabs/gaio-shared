<template>
	<NCollapseTransition :show="isActive">
		<Transition
			enter-active-class="transition-opacity absolute top-0 left-0 duration-500"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity absolute top-0 left-0 duration-500"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="shouldRender"
				v-show="shouldShow"
			>
				<slot />
			</div>
		</Transition>
	</NCollapseTransition>
</template>

<script setup lang="ts">
import { NCollapseTransition } from 'naive-ui'
import { inject, computed, onMounted, defineProps, ref, watch } from 'vue'

interface Tab {
	name: string
	label: string
}

const props = defineProps({
	name: { type: String, required: true },
	label: { type: String, required: true },
	displayDirective: {
		type: String as PropType<'if' | 'show' | 'show:lazy'>,
		default: 'if',
	},
})

const registerTab = inject<(tab: Tab) => void>('registerTab')
const currentTab = inject<{ value: string }>('currentTab')

if (!registerTab || !currentTab) {
	throw new Error('GTab must be used within GTabs')
}

onMounted(() => {
	registerTab({
		name: props.name,
		label: props.label,
	})
})

const isActive = computed(() => currentTab.value === props.name)
const hasBeenActive = ref(false)

watch(isActive, (newVal) => {
	if (newVal) {
		hasBeenActive.value = true
	}
})

const shouldRender = computed(() => {
	if (props.displayDirective === 'if') {
		return isActive.value
	} else if (props.displayDirective === 'show') {
		return true
	} else if (props.displayDirective === 'show:lazy') {
		return hasBeenActive.value
	}
	return false
})

const shouldShow = computed(() => {
	if (props.displayDirective === 'if') {
		return true
	} else {
		return isActive.value
	}
})
</script>
