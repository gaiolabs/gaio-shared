<template>
	<div
		v-if="option.isLeaf"
		class="sidebar-form-label"
		@click="select"
	>
		<div class="flex items-center justify-between">{{ option.label }} fsfs</div>
	</div>
	<div
		v-else
		class="sidebar-form-label"
	>
		{{ option.label }}
	</div>
</template>
<script setup lang="ts">
import { useAppStore, useFormStore } from '@/stores'
import type { TreeOption } from 'naive-ui'

const emit = defineEmits(['choose'])
const props = defineProps<{ option: TreeOption }>()

const select = () => {
	useFormStore().current = useAppStore().forms.find((form) => form.formId === props.option.key)
	emit('choose', { type: 'form' })
}
</script>
