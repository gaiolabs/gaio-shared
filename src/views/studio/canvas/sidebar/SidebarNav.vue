<template>
	<nav
		id="sidebar-nav"
		class="z-1 absolute top-[50%] flex min-w-[52px] items-center"
	>
		<div class="absolute z-0 ms-3 flex w-[40px] flex-col items-center justify-center rounded-2xl g-base">
			<div
				v-for="item of sidebarActions"
				:key="item.name"
				class="flex h-[50px] w-full items-center justify-center"
			>
				<button @click="workWithPanel(item.name)">
					<IconComponent
						:name="item.icon"
						class="text-lg text-gray-700 dark:text-gray-500 hover:dark:text-white hover:text-sepia-600 transition-colors duration-150"
						:class="item.class"
					/>
				</button>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: string | undefined }>()
const showPanel = ref(false)
const panel = ref('')

const sidebarActions = [
	{
		name: 'flow',
		icon: 'Studio',
		class: 'rotate-[-90deg]',
	},
	{
		name: 'database',
		icon: 'DataSources',
	},
	{
		name: 'tasks',
		icon: 'Tasks',
	},
	{
		name: 'params',
		icon: 'Params',
	},
	{
		name: 'forms',
		icon: 'Forms',
	},
	{
		name: 'files',
		icon: 'Files',
	},
	{
		name: 'discovery',
		icon: 'Discovery',
	},
]

const isPaneActive = (type: string) => {
	return panel.value === type
}

const workWithPanel = (type: string) => {
	if (props.modelValue === type) {
		return emit('update:modelValue', null)
	}
	emit('update:modelValue', type)
	// if (panel.value === type) {
	//     closePanel();
	// } else {
	//     showPanel.value = true;
	//     panel.value = type;
	// }
}

watch(
	() => showPanel.value,
	() => {
		emit('update:modelValue', panel.value)
	},
)

onMounted(() => {
	if (props.modelValue) {
		showPanel.value = true
		panel.value = 'flow'
	}
})
</script>
